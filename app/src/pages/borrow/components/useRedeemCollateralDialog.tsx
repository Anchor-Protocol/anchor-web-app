import { fabricateRedeemCollateral } from '@anchor-protocol/anchor-js/fabricators';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { Dialog } from '@anchor-protocol/neumorphism-ui/components/Dialog';
import { NumberInput } from '@anchor-protocol/neumorphism-ui/components/NumberInput';
import { Tooltip } from '@anchor-protocol/neumorphism-ui/components/Tooltip';
import {
  formatLuna,
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
import big from 'big.js';
import { TxFeeList, TxFeeListItem } from 'components/messages/TxFeeList';
import { WarningArticle } from 'components/messages/WarningArticle';
import { useBank } from 'contexts/bank';
import { useAddressProvider } from 'contexts/contract';
import { fixedGasUUSD, transactionFee } from 'env';
import { LTVGraph } from 'pages/borrow/components/LTVGraph';
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
  // compute
  // ---------------------------------------------
  const userLtv = useMemo(() => {
    if (bAssetAmount.length === 0) {
      return undefined;
    }

    const userAmount = big(bAssetAmount).mul(MICRO);

    return big(marketUserOverview.loanAmount.loan_amount).div(
      big(
        big(marketUserOverview.borrowInfo.balance)
          .minus(marketUserOverview.borrowInfo.spendable)
          .minus(userAmount),
      ).mul(marketOverview.oraclePrice.rate),
    );
  }, [
    bAssetAmount,
    marketOverview.oraclePrice.rate,
    marketUserOverview.borrowInfo.balance,
    marketUserOverview.borrowInfo.spendable,
    marketUserOverview.loanAmount.loan_amount,
  ]);

  // If user_ltv >= 0.35:
  //   withdrawable = borrow_info.spendable
  // else:
  //   withdrawable = borrow_info.balance - borrow_info.spendable - 100 * loan_amount / 35 * oracle_price + borrow_info.spendable
  const maxBAssetAmount = useMemo(() => {
    return userLtv && userLtv.gte(0.35)
      ? big(marketUserOverview.borrowInfo.spendable)
      : big(marketUserOverview.borrowInfo.balance)
          .minus(marketUserOverview.borrowInfo.spendable)
          .minus(100)
          .mul(marketUserOverview.loanAmount.loan_amount)
          .div(35)
          .mul(marketOverview.oraclePrice.rate)
          .plus(marketUserOverview.borrowInfo.spendable);
    //return big(marketUserOverview.borrowInfo.balance).minus(
    //  marketUserOverview.borrowInfo.spendable,
    //);
  }, [
    marketOverview.oraclePrice.rate,
    marketUserOverview.borrowInfo.balance,
    marketUserOverview.borrowInfo.spendable,
    marketUserOverview.loanAmount.loan_amount,
    userLtv,
  ]);

  const borrowLimit = useMemo(() => {
    // New Borrow Limit = ((Borrow_info.balance - Borrow_info.spendable - redeemed_collateral) * Oracleprice) * Max_LTV
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
      return 'Not enough Tx Fee';
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
                updateBAssetAmount(big(maxBAssetAmount).div(MICRO).toString())
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
          <LTVGraph maxLtv={marketOverview.bLunaMaxLtv} userLtv={userLtv} />
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
