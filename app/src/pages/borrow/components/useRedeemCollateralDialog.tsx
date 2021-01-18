import { fabricateRedeemCollateral } from '@anchor-protocol/anchor-js/fabricators';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { Dialog } from '@anchor-protocol/neumorphism-ui/components/Dialog';
import { NumberInput } from '@anchor-protocol/neumorphism-ui/components/NumberInput';
import { Tooltip } from '@anchor-protocol/neumorphism-ui/components/Tooltip';
import {
  formatLuna,
  formatLunaInput,
  formatUST,
  formatUSTInput,
  LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
  MICRO,
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
import { InfoOutlined } from '@material-ui/icons';
import { CreateTxOptions } from '@terra-money/terra.js';
import * as txi from 'api/queries/txInfos';
import { queryOptions } from 'api/transactions/queryOptions';
import {
  parseResult,
  StringifiedTxResult,
  TxResult,
} from 'api/transactions/tx';
import {
  txNotificationFactory,
  TxResultRenderer,
} from 'api/transactions/TxResultRenderer';
import big, { Big } from 'big.js';
import { TxFeeList, TxFeeListItem } from 'components/messages/TxFeeList';
import { WarningArticle } from 'components/messages/WarningArticle';
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

export function useRedeemCollateralDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog(Template);
}

const Template: DialogTemplate<FormParams, FormReturn> = (props) => {
  return <Component {...props} />;
};

const txFee = fixedGasUUSD;

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

  const [
    queryRedeemCollateral,
    redeemCollateralResult,
    resetRedeemCollateralResult,
  ] = useBroadcastableQuery(redeemCollateralQueryOptions);

  const client = useApolloClient();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [bAssetAmount, setBAssetAmount] = useState('');

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  // ---------------------------------------------
  // calculate
  // ---------------------------------------------
  const amountToLtv = useCallback(
    (amount: Big) => {
      return big(marketUserOverview.loanAmount.loan_amount).div(
        big(
          big(marketUserOverview.borrowInfo.balance)
            .minus(marketUserOverview.borrowInfo.spendable)
            .minus(amount),
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
      return big(marketUserOverview.borrowInfo.balance).minus(
        big(marketUserOverview.loanAmount.loan_amount).div(
          ltv.mul(marketOverview.oraclePrice.rate),
        ),
      );
    },
    [
      marketOverview.oraclePrice.rate,
      marketUserOverview.borrowInfo.balance,
      marketUserOverview.loanAmount.loan_amount,
    ],
  );

  // ---------------------------------------------
  // compute
  // ---------------------------------------------
  const currentLtv = useCurrentLtv({ marketOverview, marketUserOverview });

  // Loan_amount / ((Borrow_info.balance - Borrow_info.spendable - redeemed_collateral) * Oracleprice)
  const nextLtv = useMemo(() => {
    if (bAssetAmount.length === 0) {
      return currentLtv;
    }

    const userAmount = big(bAssetAmount).mul(MICRO);

    try {
      const ltv = amountToLtv(userAmount);
      return ltv.lt(0) ? big(0) : ltv;
    } catch {
      return currentLtv;
    }
  }, [amountToLtv, bAssetAmount, currentLtv]);

  // If user_ltv >= 0.35 or user_ltv == Null:
  //   withdrawable = borrow_info.spendable
  // else:
  //   withdrawable = borrow_info.balance - borrow_info.loan_amount / 0.35 / oracle_price
  const maxBAssetAmount = useMemo(() => {
    const withdrawable =
      !nextLtv || nextLtv.gte(marketOverview.bLunaMaxLtv)
        ? big(marketUserOverview.borrowInfo.spendable)
        : big(marketUserOverview.borrowInfo.balance).minus(
            big(marketUserOverview.loanAmount.loan_amount)
              .div(marketOverview.bLunaSafeLtv)
              .div(marketOverview.oraclePrice.rate),
          );

    return withdrawable.lt(0) ? big(0) : withdrawable;
  }, [
    marketOverview.bLunaMaxLtv,
    marketOverview.bLunaSafeLtv,
    marketOverview.oraclePrice.rate,
    marketUserOverview.borrowInfo.balance,
    marketUserOverview.borrowInfo.spendable,
    marketUserOverview.loanAmount.loan_amount,
    nextLtv,
  ]);

  // New Borrow Limit = ((Borrow_info.balance - Borrow_info.spendable - redeemed_collateral) * Oracleprice) * Max_LTV
  const borrowLimit = useMemo(() => {
    return bAssetAmount.length > 0
      ? big(
          big(
            big(marketUserOverview.borrowInfo.balance)
              .minus(marketUserOverview.borrowInfo.spendable)
              .minus(big(bAssetAmount).mul(MICRO)),
          ).mul(marketOverview.oraclePrice.rate),
        ).mul(marketOverview.bLunaMaxLtv)
      : undefined;
  }, [
    bAssetAmount,
    marketOverview.bLunaMaxLtv,
    marketOverview.oraclePrice.rate,
    marketUserOverview.borrowInfo.balance,
    marketUserOverview.borrowInfo.spendable,
  ]);

  const invalidTxFee = useMemo(() => {
    if (bank.status === 'demo') {
      return undefined;
    } else if (big(bank.userBalances.uUSD ?? 0).lt(fixedGasUUSD)) {
      return 'Not enough Transaction fee: User wallet might lack of Tx fee (Tax, Gas)';
    }
    return undefined;
  }, [bank.status, bank.userBalances.uUSD]);

  const invalidBAssetAmount = useMemo<ReactNode>(() => {
    if (bank.status === 'demo') {
      return undefined;
    } else if (
      big(bAssetAmount.length > 0 ? bAssetAmount : 0)
        .mul(MICRO)
        .gt(maxBAssetAmount ?? 0)
    ) {
      return `Insufficient balance: Not enough Assets`;
    }
    return undefined;
  }, [bAssetAmount, bank.status, maxBAssetAmount]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateBAssetAmount = useCallback((nextBAssetAmount: string) => {
    setBAssetAmount(nextBAssetAmount);
  }, []);

  const proceed = useCallback(
    async ({
      status,
      bAssetAmount,
    }: {
      status: WalletStatus;
      bAssetAmount: string;
    }) => {
      if (status.status !== 'ready' || bank.status !== 'connected') {
        return;
      }

      await queryRedeemCollateral({
        post: post<CreateTxOptions, StringifiedTxResult>({
          ...transactionFee,
          msgs: fabricateRedeemCollateral({
            address: status.status === 'ready' ? status.walletAddress : '',
            market: 'ust',
            amount: bAssetAmount.length > 0 ? bAssetAmount : '0',
          })(addressProvider),
        }).then(({ payload }) => parseResult(payload)),
        client,
      });
    },
    [addressProvider, bank.status, client, post, queryRedeemCollateral],
  );

  const onLtvChange = useCallback(
    (nextLtv: Big) => {
      try {
        const nextAmount = ltvToAmount(nextLtv);
        updateBAssetAmount(formatLunaInput(big(nextAmount).div(MICRO)));
      } catch {}
    },
    [ltvToAmount, updateBAssetAmount],
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
    redeemCollateralResult?.status === 'in-progress' ||
    redeemCollateralResult?.status === 'done' ||
    redeemCollateralResult?.status === 'error'
  ) {
    return (
      <Modal open disableBackdropClick>
        <Dialog className={className}>
          <h1>Redeem Collateral</h1>
          <TxResultRenderer
            result={redeemCollateralResult}
            resetResult={() => {
              resetRedeemCollateralResult && resetRedeemCollateralResult();
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
        <h1>Redeem Collateral</h1>

        {!!invalidTxFee && <WarningArticle>{invalidTxFee}</WarningArticle>}

        <NumberInput
          className="amount"
          value={bAssetAmount}
          maxDecimalPoints={LUNA_INPUT_MAXIMUM_DECIMAL_POINTS}
          label="REDEEM AMOUNT"
          error={!!invalidBAssetAmount}
          onChange={({ target }) => updateBAssetAmount(target.value)}
          InputProps={{
            endAdornment: <InputAdornment position="end">bLUNA</InputAdornment>,
          }}
        />

        <div className="wallet" aria-invalid={!!invalidBAssetAmount}>
          <span>{invalidBAssetAmount}</span>
          <span>
            Withdrawable:{' '}
            <span
              style={{
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
              onClick={() =>
                updateBAssetAmount(
                  formatLunaInput(big(maxBAssetAmount).div(MICRO)),
                )
              }
            >
              {formatLuna(big(maxBAssetAmount).div(MICRO))} bLUNA
            </span>
          </span>
        </div>

        <NumberInput
          className="limit"
          value={borrowLimit ? formatUSTInput(borrowLimit.div(MICRO)) : ''}
          label="NEW BORROW LIMIT"
          InputProps={{
            endAdornment: <InputAdornment position="end">UST</InputAdornment>,
          }}
          style={{ pointerEvents: 'none' }}
        />

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

        {bAssetAmount.length > 0 && (
          <TxFeeList className="receipt">
            <TxFeeListItem
              label={
                <>
                  Tx Fee{' '}
                  <Tooltip title="Tx Fee Description" placement="top">
                    <InfoOutlined />
                  </Tooltip>
                </>
              }
            >
              {formatUST(big(txFee).div(MICRO))} UST
            </TxFeeListItem>
          </TxFeeList>
        )}

        <ActionButton
          className="proceed"
          disabled={
            status.status !== 'ready' ||
            bank.status !== 'connected' ||
            bAssetAmount.length === 0 ||
            big(bAssetAmount).lte(0) ||
            !!invalidTxFee ||
            !!invalidBAssetAmount
          }
          onClick={() => proceed({ status, bAssetAmount })}
        >
          Proceed
        </ActionButton>
      </Dialog>
    </Modal>
  );
}

const redeemCollateralQueryOptions: BroadcastableQueryOptions<
  { post: Promise<TxResult>; client: ApolloClient<any> },
  { txResult: TxResult } & { txInfos: txi.Data },
  Error
> = {
  ...queryOptions,
  group: 'borrow/redeem-collateral',
  notificationFactory: txNotificationFactory,
};

const Component = styled(ComponentBase)`
  width: 720px;

  h1 {
    font-size: 27px;
    text-align: center;
    font-weight: 300;

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

    margin-bottom: 25px;
  }

  .limit {
    width: 100%;
    margin-bottom: 60px;
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
