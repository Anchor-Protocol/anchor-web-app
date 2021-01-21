import { fabricateBorrow } from '@anchor-protocol/anchor-js/fabricators';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { Dialog } from '@anchor-protocol/neumorphism-ui/components/Dialog';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { NumberInput } from '@anchor-protocol/neumorphism-ui/components/NumberInput';
import {
  formatPercentage,
  formatUST,
  formatUSTInput,
  MICRO,
  UST_INPUT_MAXIMUM_DECIMAL_POINTS,
  UST_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import {
  BroadcastableQueryOptions,
  useBroadcastableQuery,
} from '@anchor-protocol/use-broadcastable-query';
import type {
  DialogProps,
  DialogTemplate,
  OpenDialog,
} from '@anchor-protocol/use-dialog';
import { useDialog } from '@anchor-protocol/use-dialog';
import { useWallet, WalletStatus } from '@anchor-protocol/wallet-provider';
import { ApolloClient, useApolloClient } from '@apollo/client';
import { InputAdornment, Modal } from '@material-ui/core';
import { CreateTxOptions } from '@terra-money/terra.js';
import * as txi from 'queries/txInfos';
import { queryOptions } from 'transactions/queryOptions';
import { parseResult, StringifiedTxResult, TxResult } from 'transactions/tx';
import {
  txNotificationFactory,
  TxResultRenderer,
} from 'components/TxResultRenderer';
import big, { Big } from 'big.js';
import { InfoTooltip } from '@anchor-protocol/neumorphism-ui/components/InfoTooltip';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { WarningArticle } from 'components/WarningArticle';
import { BLOCKS_PER_YEAR } from 'constants/BLOCKS_PER_YEAR';
import { useBank } from 'contexts/bank';
import { useAddressProvider } from 'contexts/contract';
import { fixedGasUUSD, transactionFee } from 'env';
import { LTVGraph } from 'pages/borrow/components/LTVGraph';
import { useCurrentLtv } from 'pages/borrow/components/useCurrentLtv';
import { Data as MarketOverview } from 'pages/borrow/queries/marketOverview';
import { Data as MarketUserOverview } from 'pages/borrow/queries/marketUserOverview';
import type { ReactNode } from 'react';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

interface FormParams {
  className?: string;
  marketOverview: MarketOverview;
  marketUserOverview: MarketUserOverview;
}

type FormReturn = void;

export function useBorrowDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog(Template);
}

const Template: DialogTemplate<FormParams, FormReturn> = (props) => {
  return <Component {...props} />;
};

function ComponentBase({
  className,
  marketOverview,
  marketUserOverview,
  closeDialog,
}: DialogProps<FormParams, FormReturn>) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { status, post } = useWallet();

  const addressProvider = useAddressProvider();

  const [queryBorrow, borrowResult, resetBorrowResult] = useBroadcastableQuery(
    borrowQueryOptions,
  );

  const client = useApolloClient();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [assetAmount, setAssetAmount] = useState('');

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  // ---------------------------------------------
  // calculate
  // ---------------------------------------------
  const amountToLtv = useCallback(
    (amount: Big) => {
      return big(
        big(marketUserOverview.loanAmount.loan_amount).plus(amount),
      ).div(
        big(
          big(marketUserOverview.borrowInfo.balance).minus(
            marketUserOverview.borrowInfo.spendable,
          ),
        ).mul(marketOverview.oraclePrice.rate),
      );
    },
    [
      marketOverview.oraclePrice.rate,
      marketUserOverview.borrowInfo.balance,
      marketUserOverview.borrowInfo.spendable,
      marketUserOverview.loanAmount.loan_amount,
    ],
  );

  const ltvToAmount = useCallback(
    (ltv: Big) => {
      return ltv
        .mul(
          big(marketUserOverview.borrowInfo.balance)
            .minus(marketUserOverview.borrowInfo.spendable)
            .mul(marketOverview.oraclePrice.rate),
        )
        .minus(marketUserOverview.loanAmount.loan_amount);
    },
    [
      marketOverview.oraclePrice.rate,
      marketUserOverview.borrowInfo.balance,
      marketUserOverview.borrowInfo.spendable,
      marketUserOverview.loanAmount.loan_amount,
    ],
  );

  // ---------------------------------------------
  // compute
  // ---------------------------------------------
  const currentLtv = useCurrentLtv({ marketOverview, marketUserOverview });

  // (Loan_amount + borrow_amount) / ((Borrow_info.balance - Borrow_info.spendable - redeemed_collateral) * Oracleprice)
  const nextLtv = useMemo(() => {
    if (assetAmount.length === 0) {
      return currentLtv;
    }

    const userAmount = big(assetAmount).mul(MICRO);

    try {
      const ltv = amountToLtv(userAmount);
      return ltv.lt(0) ? big(0) : ltv;
    } catch {
      return currentLtv;
    }
  }, [amountToLtv, assetAmount, currentLtv]);

  const apr = useMemo(() => {
    return big(marketOverview.borrowRate.rate ?? 0).mul(BLOCKS_PER_YEAR);
  }, [marketOverview.borrowRate.rate]);

  // If user_ltv >= 0.35 or user_ltv == Null:
  //   SafeMax = 0
  // else:
  //   safemax = 0.35 * (balance - spendable) * oracle_price - loan_amount
  const safeMax = useMemo(() => {
    return !currentLtv || currentLtv.gte(marketOverview.bLunaSafeLtv)
      ? big(0)
      : big(marketOverview.bLunaSafeLtv)
          .mul(
            big(marketUserOverview.borrowInfo.balance).minus(
              marketUserOverview.borrowInfo.spendable,
            ),
          )
          .mul(marketOverview.oraclePrice.rate)
          .minus(marketUserOverview.loanAmount.loan_amount);
  }, [
    currentLtv,
    marketOverview.bLunaSafeLtv,
    marketOverview.oraclePrice.rate,
    marketUserOverview.borrowInfo.balance,
    marketUserOverview.borrowInfo.spendable,
    marketUserOverview.loanAmount.loan_amount,
  ]);

  const max = useMemo(() => {
    return big(marketOverview.bLunaMaxLtv)
      .mul(
        big(marketUserOverview.borrowInfo.balance).minus(
          marketUserOverview.borrowInfo.spendable,
        ),
      )
      .mul(marketOverview.oraclePrice.rate)
      .minus(marketUserOverview.loanAmount.loan_amount);
  }, [
    marketOverview.bLunaMaxLtv,
    marketOverview.oraclePrice.rate,
    marketUserOverview.borrowInfo.balance,
    marketUserOverview.borrowInfo.spendable,
    marketUserOverview.loanAmount.loan_amount,
  ]);

  const txFee = useMemo(() => {
    if (assetAmount.length === 0) {
      return undefined;
    }

    const userAmount = big(assetAmount).mul(MICRO);

    const userAmountTxFee = big(
      userAmount.minus(userAmount).div(big(1).plus(bank.tax.taxRate)),
    ).mul(bank.tax.taxRate);

    if (userAmountTxFee.gt(bank.tax.maxTaxUUSD)) {
      return big(bank.tax.maxTaxUUSD).plus(fixedGasUUSD);
    } else {
      return userAmountTxFee.plus(fixedGasUUSD);
    }
  }, [assetAmount, bank.tax.maxTaxUUSD, bank.tax.taxRate]);

  const estimatedAmount = useMemo(() => {
    return assetAmount.length > 0 && txFee
      ? big(assetAmount).mul(MICRO).minus(txFee)
      : undefined;
  }, [assetAmount, txFee]);

  const invalidTxFee = useMemo(() => {
    if (bank.status === 'demo') {
      return undefined;
    } else if (big(bank.userBalances.uUSD ?? 0).lt(fixedGasUUSD)) {
      return 'Not enough transaction fees';
    }
    return undefined;
  }, [bank.status, bank.userBalances.uUSD]);

  const invalidAssetAmount = useMemo<ReactNode>(() => {
    if (bank.status === 'demo') {
      return undefined;
    } else if (
      big(assetAmount.length > 0 ? assetAmount : 0)
        .mul(MICRO)
        .gt(max ?? 0)
    ) {
      return `Cannot borrow more than the borrow limit.`;
    }
    return undefined;
  }, [assetAmount, bank.status, max]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateAssetAmount = useCallback((nextAssetAmount: string) => {
    setAssetAmount(nextAssetAmount);
  }, []);

  const proceed = useCallback(
    async ({
      status,
      assetAmount,
    }: {
      status: WalletStatus;
      assetAmount: string;
    }) => {
      if (status.status !== 'ready' || bank.status !== 'connected') {
        return;
      }

      await queryBorrow({
        post: post<CreateTxOptions, StringifiedTxResult>({
          ...transactionFee,
          msgs: fabricateBorrow({
            address: status.status === 'ready' ? status.walletAddress : '',
            market: 'ust',
            amount: assetAmount,
            withdrawTo: undefined,
          })(addressProvider),
        }).then(({ payload }) => parseResult(payload)),
        client,
      });
    },
    [addressProvider, bank.status, client, post, queryBorrow],
  );

  const onLtvChange = useCallback(
    (nextLtv: Big) => {
      try {
        const nextAmount = ltvToAmount(nextLtv);
        updateAssetAmount(formatUSTInput(big(nextAmount).div(MICRO)));
      } catch {}
    },
    [ltvToAmount, updateAssetAmount],
  );

  const ltvStepFunction = useCallback(
    (draftLtv: Big) => {
      try {
        const draftAmount = ltvToAmount(draftLtv);
        return amountToLtv(big(draftAmount));
      } catch {
        return draftLtv;
      }
    },
    [ltvToAmount, amountToLtv],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    borrowResult?.status === 'in-progress' ||
    borrowResult?.status === 'done' ||
    borrowResult?.status === 'error'
  ) {
    return (
      <Modal open disableBackdropClick>
        <Dialog className={className}>
          <h1>
            Borrow<p>Borrow APR: {formatPercentage(apr.mul(100))}%</p>
          </h1>
          <TxResultRenderer
            result={borrowResult}
            resetResult={() => {
              resetBorrowResult && resetBorrowResult();
              closeDialog();
            }}
          />
        </Dialog>
      </Modal>
    );
  }

  return (
    <Modal open>
      <Dialog className={className} onClose={() => closeDialog()}>
        <h1>
          Borrow<p>Borrow APR: {formatPercentage(apr.mul(100))}%</p>
        </h1>

        {!!invalidTxFee && <WarningArticle>{invalidTxFee}</WarningArticle>}

        <NumberInput
          className="amount"
          value={assetAmount}
          maxIntegerPoinsts={UST_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={UST_INPUT_MAXIMUM_DECIMAL_POINTS}
          label="BORROW AMOUNT"
          error={!!invalidAssetAmount}
          onChange={({ target }) => updateAssetAmount(target.value)}
          InputProps={{
            endAdornment: <InputAdornment position="end">UST</InputAdornment>,
          }}
        />

        <div className="wallet" aria-invalid={!!invalidAssetAmount}>
          <span>{invalidAssetAmount}</span>
          <span>
            Safe Max:{' '}
            <span
              style={{
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
              onClick={() =>
                updateAssetAmount(formatUSTInput(big(safeMax).div(MICRO)))
              }
            >
              {formatUST(big(safeMax ?? 0).div(MICRO))} UST
            </span>
          </span>
        </div>

        <figure className="graph">
          <LTVGraph
            maxLtv={marketOverview.bLunaMaxLtv}
            safeLtv={marketOverview.bLunaSafeLtv}
            currentLtv={currentLtv}
            nextLtv={nextLtv}
            userMinLtv={currentLtv}
            userMaxLtv={marketOverview.bLunaMaxLtv}
            onStep={ltvStepFunction}
            onChange={onLtvChange}
          />
        </figure>

        {txFee && estimatedAmount && (
          <TxFeeList className="receipt">
            <TxFeeListItem
              label={
                <IconSpan>
                  Tx Fee <InfoTooltip>Tx Fee Description</InfoTooltip>
                </IconSpan>
              }
            >
              {formatUST(txFee.div(MICRO))} UST
            </TxFeeListItem>
            <TxFeeListItem label="Estimated Amount">
              {formatUST(estimatedAmount.div(MICRO))} UST
            </TxFeeListItem>
          </TxFeeList>
        )}

        <ActionButton
          className="proceed"
          disabled={
            status.status !== 'ready' ||
            bank.status !== 'connected' ||
            assetAmount.length === 0 ||
            big(assetAmount).lte(0) ||
            !!invalidTxFee ||
            !!invalidAssetAmount
          }
          onClick={() => proceed({ status, assetAmount: assetAmount })}
        >
          Proceed
        </ActionButton>
      </Dialog>
    </Modal>
  );
}

const borrowQueryOptions: BroadcastableQueryOptions<
  { post: Promise<TxResult>; client: ApolloClient<any> },
  { txResult: TxResult } & { txInfos: txi.Data },
  Error
> = {
  ...queryOptions,
  group: 'borrow/borrow',
  notificationFactory: txNotificationFactory,
};

const Component = styled(ComponentBase)`
  width: 720px;

  h1 {
    font-size: 27px;
    text-align: center;
    font-weight: 300;

    p {
      font-size: 14px;
      margin-top: 10px;
    }

    margin-bottom: 50px;
  }

  .amount {
    width: 100%;
    margin-bottom: 5px;

    .MuiTypography-colorTextSecondary {
      color: currentColor;
    }
  }

  .wallet {
    display: flex;
    justify-content: space-between;

    font-size: 12px;
    color: ${({ theme }) => theme.dimTextColor};

    &[aria-invalid='true'] {
      color: #f5356a;
    }

    margin-bottom: 45px;
  }

  .graph {
    margin-bottom: 40px;
  }

  .receipt {
    margin-bottom: 30px;
  }

  .proceed {
    width: 100%;
    height: 60px;
    border-radius: 30px;
  }
`;
