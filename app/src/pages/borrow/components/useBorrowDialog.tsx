import { fabricateBorrow } from '@anchor-protocol/anchor-js/fabricators';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { Dialog } from '@anchor-protocol/neumorphism-ui/components/Dialog';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@anchor-protocol/neumorphism-ui/components/InfoTooltip';
import { NumberInput } from '@anchor-protocol/neumorphism-ui/components/NumberInput';
import {
  demicrofy,
  formatRatioToPercentage,
  formatUST,
  formatUSTInput,
  microfy,
  Ratio,
  UST,
  UST_INPUT_MAXIMUM_DECIMAL_POINTS,
  UST_INPUT_MAXIMUM_INTEGER_POINTS,
  uUST,
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
import big, { Big } from 'big.js';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import {
  txNotificationFactory,
  TxResultRenderer,
} from 'components/TxResultRenderer';
import { WarningArticle } from 'components/WarningArticle';
import { BLOCKS_PER_YEAR } from 'constants/BLOCKS_PER_YEAR';
import { useBank } from 'contexts/bank';
import { useAddressProvider } from 'contexts/contract';
import { fixedGasUUSD, transactionFee } from 'env';
import { LTVGraph } from 'pages/borrow/components/LTVGraph';
import { useCurrentLtv } from 'pages/borrow/components/useCurrentLtv';
import { Data as MarketOverview } from 'pages/borrow/queries/marketOverview';
import { Data as MarketUserOverview } from 'pages/borrow/queries/marketUserOverview';
import * as txi from 'queries/txInfos';
import type { ReactNode } from 'react';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { queryOptions } from 'transactions/queryOptions';
import { parseResult, StringifiedTxResult, TxResult } from 'transactions/tx';

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
  const [borrowAmount, setBorrowAmount] = useState<UST>('' as UST);

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  // ---------------------------------------------
  // calculate
  // ---------------------------------------------
  const amountToLtv = useCallback(
    (borrowAmount: uUST<Big>): Ratio<Big> => {
      return big(
        big(marketUserOverview.loanAmount.loan_amount).plus(borrowAmount),
      ).div(
        big(
          big(marketUserOverview.borrowInfo.balance).minus(
            marketUserOverview.borrowInfo.spendable,
          ),
        ).mul(marketOverview.oraclePrice.rate),
      ) as Ratio<Big>;
    },
    [
      marketOverview.oraclePrice.rate,
      marketUserOverview.borrowInfo.balance,
      marketUserOverview.borrowInfo.spendable,
      marketUserOverview.loanAmount.loan_amount,
    ],
  );

  const ltvToAmount = useCallback(
    (ltv: Ratio<Big>): uUST<Big> => {
      return ltv
        .mul(
          big(marketUserOverview.borrowInfo.balance)
            .minus(marketUserOverview.borrowInfo.spendable)
            .mul(marketOverview.oraclePrice.rate),
        )
        .minus(marketUserOverview.loanAmount.loan_amount) as uUST<Big>;
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
  const nextLtv = useMemo<Ratio<Big> | undefined>(() => {
    if (borrowAmount.length === 0) {
      return currentLtv;
    }

    const amount = microfy(borrowAmount);

    try {
      const ltv = amountToLtv(amount);
      return ltv.lt(0) ? (big(0) as Ratio<Big>) : ltv;
    } catch {
      return currentLtv;
    }
  }, [amountToLtv, borrowAmount, currentLtv]);

  const apr = useMemo<Ratio<Big>>(() => {
    return big(marketOverview.borrowRate.rate ?? 0).mul(
      BLOCKS_PER_YEAR,
    ) as Ratio<Big>;
  }, [marketOverview.borrowRate.rate]);

  // If user_ltv >= 0.35 or user_ltv == Null:
  //   SafeMax = 0
  // else:
  //   safemax = 0.35 * (balance - spendable) * oracle_price - loan_amount
  const safeMax = useMemo<uUST<Big>>(() => {
    return !currentLtv || currentLtv.gte(marketOverview.bLunaSafeLtv)
      ? (big(0) as uUST<Big>)
      : (big(marketOverview.bLunaSafeLtv)
          .mul(
            big(marketUserOverview.borrowInfo.balance).minus(
              marketUserOverview.borrowInfo.spendable,
            ),
          )
          .mul(marketOverview.oraclePrice.rate)
          .minus(marketUserOverview.loanAmount.loan_amount) as uUST<Big>);
  }, [
    currentLtv,
    marketOverview.bLunaSafeLtv,
    marketOverview.oraclePrice.rate,
    marketUserOverview.borrowInfo.balance,
    marketUserOverview.borrowInfo.spendable,
    marketUserOverview.loanAmount.loan_amount,
  ]);

  const max = useMemo<uUST<Big>>(() => {
    return big(marketOverview.bLunaMaxLtv)
      .mul(
        big(marketUserOverview.borrowInfo.balance).minus(
          marketUserOverview.borrowInfo.spendable,
        ),
      )
      .mul(marketOverview.oraclePrice.rate)
      .minus(marketUserOverview.loanAmount.loan_amount) as uUST<Big>;
  }, [
    marketOverview.bLunaMaxLtv,
    marketOverview.oraclePrice.rate,
    marketUserOverview.borrowInfo.balance,
    marketUserOverview.borrowInfo.spendable,
    marketUserOverview.loanAmount.loan_amount,
  ]);

  const txFee = useMemo<uUST<Big> | undefined>(() => {
    if (borrowAmount.length === 0) {
      return undefined;
    }

    const amount = microfy(borrowAmount);

    const userAmountTxFee = big(
      amount.minus(amount).div(big(1).plus(bank.tax.taxRate)),
    ).mul(bank.tax.taxRate);

    if (userAmountTxFee.gt(bank.tax.maxTaxUUSD)) {
      return big(bank.tax.maxTaxUUSD).plus(fixedGasUUSD) as uUST<Big>;
    } else {
      return userAmountTxFee.plus(fixedGasUUSD) as uUST<Big>;
    }
  }, [borrowAmount, bank.tax.maxTaxUUSD, bank.tax.taxRate]);

  const receiveAmount = useMemo<uUST<Big> | undefined>(() => {
    return borrowAmount.length > 0 && txFee
      ? (microfy(borrowAmount).minus(txFee) as uUST<Big>)
      : undefined;
  }, [borrowAmount, txFee]);

  const invalidTxFee = useMemo<ReactNode>(() => {
    if (bank.status === 'demo') {
      return undefined;
    } else if (big(bank.userBalances.uUSD ?? 0).lt(fixedGasUUSD)) {
      return 'Not enough transaction fees';
    }
    return undefined;
  }, [bank.status, bank.userBalances.uUSD]);

  const invalidAssetAmount = useMemo<ReactNode>(() => {
    if (bank.status === 'demo' || borrowAmount.length === 0) {
      return undefined;
    } else if (microfy(borrowAmount).gt(max ?? 0)) {
      return `Cannot borrow more than the borrow limit.`;
    }
    return undefined;
  }, [borrowAmount, bank.status, max]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateBorrowAmount = useCallback((nextBorrowAmount: string) => {
    setBorrowAmount(nextBorrowAmount as UST);
  }, []);

  const proceed = useCallback(
    async ({
      status,
      borrowAmount,
    }: {
      status: WalletStatus;
      borrowAmount: UST;
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
            amount: borrowAmount,
            withdrawTo: undefined,
          })(addressProvider),
        }).then(({ payload }) => parseResult(payload)),
        client,
      });
    },
    [addressProvider, bank.status, client, post, queryBorrow],
  );

  const onLtvChange = useCallback(
    (nextLtv: Ratio<Big>) => {
      try {
        const nextAmount = ltvToAmount(nextLtv);
        updateBorrowAmount(formatUSTInput(demicrofy(nextAmount)));
      } catch {}
    },
    [ltvToAmount, updateBorrowAmount],
  );

  const ltvStepFunction = useCallback(
    (draftLtv: Ratio<Big>): Ratio<Big> => {
      try {
        const draftAmount = ltvToAmount(draftLtv);
        return amountToLtv(draftAmount);
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
            Borrow<p>Borrow APR: {formatRatioToPercentage(apr)}%</p>
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
    <Modal open onClose={() => closeDialog()}>
      <Dialog className={className} onClose={() => closeDialog()}>
        <h1>
          Borrow<p>Borrow APR: {formatRatioToPercentage(apr)}%</p>
        </h1>

        {!!invalidTxFee && <WarningArticle>{invalidTxFee}</WarningArticle>}

        <NumberInput
          className="amount"
          value={borrowAmount}
          maxIntegerPoinsts={UST_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={UST_INPUT_MAXIMUM_DECIMAL_POINTS}
          label="BORROW AMOUNT"
          error={!!invalidAssetAmount}
          onChange={({ target }) => updateBorrowAmount(target.value)}
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
                updateBorrowAmount(formatUSTInput(demicrofy(safeMax)))
              }
            >
              {formatUST(demicrofy(safeMax))} UST
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

        {txFee && receiveAmount && (
          <TxFeeList className="receipt">
            <TxFeeListItem
              label={
                <IconSpan>
                  Tx Fee <InfoTooltip>Tx Fee Description</InfoTooltip>
                </IconSpan>
              }
            >
              {formatUST(demicrofy(txFee))} UST
            </TxFeeListItem>
            <TxFeeListItem label="Receive Amount">
              {formatUST(demicrofy(receiveAmount))} UST
            </TxFeeListItem>
          </TxFeeList>
        )}

        <ActionButton
          className="proceed"
          disabled={
            status.status !== 'ready' ||
            bank.status !== 'connected' ||
            borrowAmount.length === 0 ||
            big(borrowAmount).lte(0) ||
            !!invalidTxFee ||
            !!invalidAssetAmount
          }
          onClick={() => proceed({ status, borrowAmount })}
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
