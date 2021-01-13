import { fabricateProvideCollateral } from '@anchor-protocol/anchor-js/fabricators';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { Dialog } from '@anchor-protocol/neumorphism-ui/components/Dialog';
import { TextInput } from '@anchor-protocol/neumorphism-ui/components/TextInput';
import { Tooltip } from '@anchor-protocol/neumorphism-ui/components/Tooltip';
import {
  formatLuna,
  formatLunaUserInput,
  formatUST,
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
import { Data as MarketOverview } from 'pages/borrow/queries/marketOverview';
import type { ReactNode } from 'react';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

interface FormParams {
  className?: string;
  marketOverview: MarketOverview;
}

type FormReturn = void;

export function useProvideCollateralDialog(): [
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
  closeDialog,
}: DialogProps<FormParams, FormReturn>) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { status, post } = useWallet();

  const addressProvider = useAddressProvider();

  const [
    queryProvideCollateral,
    provideCollateralResult,
    resetProvideCollateralResult,
  ] = useBroadcastableQuery(provideCollateralQueryOptions);

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
  const borrowLimit = useMemo(() => {
    /* New Borrow Limit = ((Borrow_info.balance - Borrow_info.spendable + provided_collateral) * Oracleprice) * Max_LTV */
    return bAssetAmount.length > 0
      ? big(marketOverview.loanAmount.loan_amount)
          .div(
            big(
              big(marketOverview.borrowInfo.balance)
                .minus(marketOverview.borrowInfo.spendable)
                .plus(big(bAssetAmount).mul(MICRO)),
            ).mul(marketOverview.oraclePrice.rate),
          )
          .mul(marketOverview.bLunaMaxLtv)
      : undefined;
  }, [
    bAssetAmount,
    marketOverview.bLunaMaxLtv,
    marketOverview.borrowInfo.balance,
    marketOverview.borrowInfo.spendable,
    marketOverview.loanAmount.loan_amount,
    marketOverview.oraclePrice.rate,
  ]);

  const invalidTxFee = useMemo(() => {
    if (bank.status === 'demo') {
      return undefined;
    } else if (big(bank.userBalances.uUSD ?? 0).lt(txFee)) {
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
        .gt(bank.userBalances.ubLuna ?? 0)
    ) {
      return `Insufficient balance: Not enough Assets`;
    }
    return undefined;
  }, [bAssetAmount, bank.status, bank.userBalances.ubLuna]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateBAssetAmount = useCallback((nextBAssetAmount: string) => {
    setBAssetAmount(formatLunaUserInput(nextBAssetAmount));
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

      await queryProvideCollateral({
        post: post<CreateTxOptions, StringifiedTxResult>({
          ...transactionFee,
          msgs: fabricateProvideCollateral({
            address: status.status === 'ready' ? status.walletAddress : '',
            market: 'ust',
            symbol: 'bluna',
            amount: bAssetAmount.length > 0 ? +bAssetAmount : 0,
          })(addressProvider),
        }).then(({ payload }) => parseResult(payload)),
        client,
      });
    },
    [addressProvider, bank.status, client, post, queryProvideCollateral],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    provideCollateralResult?.status === 'in-progress' ||
    provideCollateralResult?.status === 'done' ||
    provideCollateralResult?.status === 'error'
  ) {
    return (
      <Modal open disableBackdropClick>
        <Dialog className={className}>
          <h1>Provide Collateral</h1>
          <TxResultRenderer
            result={provideCollateralResult}
            resetResult={() => {
              resetProvideCollateralResult && resetProvideCollateralResult();
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
        <h1>Provide Collateral</h1>

        {!!invalidTxFee && <WarningArticle>{invalidTxFee}</WarningArticle>}

        <TextInput
          className="amount"
          type="number"
          value={bAssetAmount}
          label="DEPOSIT AMOUNT"
          error={!!invalidBAssetAmount}
          onChange={({ target }) => updateBAssetAmount(target.value)}
          InputProps={{
            endAdornment: <InputAdornment position="end">bLUNA</InputAdornment>,
            inputMode: 'numeric',
          }}
        />

        <div className="wallet" aria-invalid={!!invalidBAssetAmount}>
          <span>{invalidBAssetAmount}</span>
          <span>
            Wallet:{' '}
            <span
              style={{
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
              onClick={() =>
                updateBAssetAmount(
                  big(bank.userBalances.ubLuna).div(MICRO).toString(),
                )
              }
            >
              {formatLuna(big(bank.userBalances.ubLuna ?? 0).div(MICRO))} bLUNA
            </span>
          </span>
        </div>

        <TextInput
          className="limit"
          type="number"
          value={borrowLimit ? formatUST(borrowLimit) : ''}
          label="NEW BORROW LIMIT"
          InputProps={{
            endAdornment: <InputAdornment position="end">UST</InputAdornment>,
            inputMode: 'numeric',
          }}
          style={{ pointerEvents: 'none' }}
        />

        {/* Loan_amount / ((Borrow_info.balance - Borrow_info.spendable + provided_collateral) * Oracleprice) * 100 */}
        <figure className="graph">graph</figure>

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

const provideCollateralQueryOptions: BroadcastableQueryOptions<
  { post: Promise<TxResult>; client: ApolloClient<any> },
  { txResult: TxResult } & { txInfos: txi.Data },
  Error
> = {
  ...queryOptions,
  group: 'borrow/provide-collateral',
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
    margin-bottom: 30px;
  }

  .graph {
    height: 60px;
    border-radius: 20px;
    border: 2px dashed ${({ theme }) => theme.textColor};

    display: grid;
    place-content: center;

    margin-bottom: 30px;
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
