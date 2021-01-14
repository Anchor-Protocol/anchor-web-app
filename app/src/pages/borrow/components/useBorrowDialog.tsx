import { fabricateBorrow } from '@anchor-protocol/anchor-js/fabricators';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { Dialog } from '@anchor-protocol/neumorphism-ui/components/Dialog';
import { TextInput } from '@anchor-protocol/neumorphism-ui/components/TextInput';
import { Tooltip } from '@anchor-protocol/neumorphism-ui/components/Tooltip';
import {
  formatPercentage,
  formatUST,
  formatUSTUserInput,
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
import { fixedGasUUSD, safeRatio, transactionFee } from 'env';
import { Data as MarketOverview } from 'pages/borrow/queries/marketOverview';
import type { ReactNode } from 'react';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

interface FormParams {
  className?: string;
  marketOverview: MarketOverview;
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
  // compute
  // ---------------------------------------------
  const apr = useMemo(() => {
    return big(marketOverview.borrowRate.rate ?? 0).mul(BLOCKS_PER_YEAR);
  }, [marketOverview.borrowRate.rate]);

  const safeMax = useMemo(() => {
    // SafeMax = MAX_LTV * Safe_Ratio * (borrow_info.balance - borrow_info.spendable) * oracle_price - Loan_amount
    return big(marketOverview.bLunaMaxLtv)
      .mul(safeRatio)
      .mul(
        big(marketOverview.borrowInfo.balance).minus(
          marketOverview.borrowInfo.spendable,
        ),
      )
      .mul(marketOverview.oraclePrice.rate)
      .minus(marketOverview.loanAmount.loan_amount);
  }, [
    marketOverview.bLunaMaxLtv,
    marketOverview.borrowInfo.balance,
    marketOverview.borrowInfo.spendable,
    marketOverview.loanAmount.loan_amount,
    marketOverview.oraclePrice.rate,
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
      return 'Not enough Tx Fee';
    }
    return undefined;
  }, [bank.status, bank.userBalances.uUSD]);

  const invalidAssetAmount = useMemo<ReactNode>(() => {
    if (bank.status === 'demo') {
      return undefined;
    } else if (
      big(assetAmount.length > 0 ? assetAmount : 0)
        .mul(MICRO)
        .gt(safeMax ?? 0)
    ) {
      return `Insufficient balance: Not enough Assets`;
    }
    return undefined;
  }, [assetAmount, bank.status, safeMax]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateAssetAmount = useCallback((nextAssetAmount: string) => {
    setAssetAmount(formatUSTUserInput(nextAssetAmount));
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

        <TextInput
          className="amount"
          type="number"
          value={assetAmount}
          label="BORROW AMOUNT"
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
                updateAssetAmount(big(safeMax).div(MICRO).toString())
              }
            >
              {formatUST(big(safeMax ?? 0).div(MICRO))} UST
            </span>
          </span>
        </div>

        <figure className="graph">graph</figure>

        {txFee && estimatedAmount && (
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
