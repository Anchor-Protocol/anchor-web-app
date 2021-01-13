import { fabricateRepay } from '@anchor-protocol/anchor-js/fabricators';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { Dialog } from '@anchor-protocol/neumorphism-ui/components/Dialog';
import { TextInput } from '@anchor-protocol/neumorphism-ui/components/TextInput';
import { Tooltip } from '@anchor-protocol/neumorphism-ui/components/Tooltip';
import {
  formatLunaUserInput,
  formatPercentage,
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
import { BLOCKS_PER_YEAR } from 'constants/BLOCKS_PER_YEAR';
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

export function useRepayDialog(): [
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
  closeDialog,
}: DialogProps<FormParams, FormReturn>) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { status, post } = useWallet();

  const addressProvider = useAddressProvider();

  const [queryRepay, repayResult, resetRepayResult] = useBroadcastableQuery(
    repayQueryOptions,
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
  // compute
  // ---------------------------------------------
  const apr = useMemo(() => {
    return big(marketOverview.borrowRate.rate).mul(BLOCKS_PER_YEAR).toFixed();
  }, [marketOverview.borrowRate.rate]);

  const totalBorrows = useMemo(() => {
    return marketOverview.loanAmount.loan_amount;
  }, [marketOverview.loanAmount.loan_amount]);

  const txFee = useMemo(() => {
    return fixedGasUUSD;
  }, []);

  const invalidTxFee = useMemo(() => {
    if (bank.status === 'demo') {
      return undefined;
    } else if (big(bank.userBalances.uUSD ?? 0).lt(txFee)) {
      return 'Not enough Tx Fee';
    }
    return undefined;
  }, [bank.status, bank.userBalances.uUSD, txFee]);

  const invalidAssetAmount = useMemo<ReactNode>(() => {
    if (bank.status === 'demo') {
      return undefined;
    } else if (
      big(assetAmount.length > 0 ? assetAmount : 0)
        .mul(MICRO)
        .gt(totalBorrows)
    ) {
      return `Insufficient balance: Not enough Assets`;
    }
    return undefined;
  }, [assetAmount, bank.status, totalBorrows]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateAssetAmount = useCallback((nextAssetAmount: string) => {
    setAssetAmount(formatLunaUserInput(nextAssetAmount));
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

      await queryRepay({
        post: post<CreateTxOptions, StringifiedTxResult>({
          ...transactionFee,
          msgs: fabricateRepay({
            address: status.status === 'ready' ? status.walletAddress : '',
            market: 'ust',
            amount: assetAmount.length > 0 ? +assetAmount : 0,
            borrower: undefined,
          })(addressProvider),
        }).then(({ payload }) => parseResult(payload)),
        client,
      });
    },
    [addressProvider, bank.status, client, post, queryRepay],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    repayResult?.status === 'in-progress' ||
    repayResult?.status === 'done' ||
    repayResult?.status === 'error'
  ) {
    return (
      <Modal open disableBackdropClick>
        <Dialog className={className}>
          <h1>
            Repay<p>Borrow APR: {formatPercentage(apr)}%</p>
          </h1>
          <TxResultRenderer
            result={repayResult}
            resetResult={() => {
              resetRepayResult && resetRepayResult();
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
          Repay<p>Borrow APR: {formatPercentage(apr)}%</p>
        </h1>

        {!!invalidTxFee && <WarningArticle>{invalidTxFee}</WarningArticle>}

        <TextInput
          className="amount"
          type="number"
          value={assetAmount}
          label="REPAY AMOUNT"
          error={!!invalidAssetAmount}
          onChange={({ target }) => updateAssetAmount(target.value)}
          InputProps={{
            endAdornment: <InputAdornment position="end">UST</InputAdornment>,
            inputMode: 'numeric',
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
                updateAssetAmount(big(totalBorrows).div(MICRO).toString())
              }
            >
              {formatUST(big(totalBorrows ?? 0).div(MICRO))} UST
            </span>
          </span>
        </div>

        <TextInput
          className="limit"
          type="number"
          disabled
          value="00"
          label="NEW BORROW LIMIT"
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
            inputMode: 'numeric',
          }}
        />

        <figure className="graph">graph</figure>

        {assetAmount.length > 0 && (
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
            assetAmount.length === 0 ||
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

const repayQueryOptions: BroadcastableQueryOptions<
  { post: Promise<TxResult>; client: ApolloClient<any> },
  { txResult: TxResult } & { txInfos: txi.Data },
  Error
> = {
  ...queryOptions,
  group: 'borrow/repay',
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
