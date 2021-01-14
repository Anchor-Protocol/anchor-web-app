import { fabricateDepositStableCoin } from '@anchor-protocol/anchor-js/fabricators';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { Dialog } from '@anchor-protocol/neumorphism-ui/components/Dialog';
import { NumberInput } from '@anchor-protocol/neumorphism-ui/components/NumberInput';
import { Tooltip } from '@anchor-protocol/neumorphism-ui/components/Tooltip';
import { useConfirm } from '@anchor-protocol/neumorphism-ui/components/useConfirm';
import { formatUST, MICRO, UST_INPUT_MAXIMUM_DECIMAL_POINTS } from '@anchor-protocol/notation';
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
import { useTax } from 'api/queries/tax';
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
import type { ReactNode } from 'react';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

interface FormParams {
  className?: string;
}

type FormReturn = void;

export function useDepositDialog(): [
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
  closeDialog,
}: DialogProps<FormParams, FormReturn>) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { status, post } = useWallet();

  const addressProvider = useAddressProvider();

  const [
    queryDeposit,
    depositResult,
    resetDepositResult,
  ] = useBroadcastableQuery(depositQueryOptions);

  const client = useApolloClient();

  const [openConfirm, confirmElement] = useConfirm();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [assetAmount, setAssetAmount] = useState<string>('');

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const bank = useBank();

  const { parsedData: tax } = useTax();

  // ---------------------------------------------
  // compute
  // ---------------------------------------------
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
        .gt(bank.userBalances.uUSD ?? 0)
    ) {
      return `Insufficient balance: Not enough Assets`;
    }
    return undefined;
  }, [assetAmount, bank.status, bank.userBalances.uUSD]);

  const txFee = useMemo(() => {
    if (assetAmount.length === 0 || !tax) return undefined;

    // MIN((User_UST_Balance - fixed_gas)/(1+Tax_rate) * tax_rate , Max_tax) + Fixed_Gas

    const uustAmount = big(assetAmount).mul(MICRO);
    const ratioTxFee = big(uustAmount.minus(fixedGasUUSD))
      .div(big(1).add(tax.taxRate))
      .mul(tax.taxRate);
    const maxTax = big(tax.maxTaxUUSD);

    if (ratioTxFee.gt(maxTax)) {
      return maxTax.add(fixedGasUUSD);
    } else {
      return ratioTxFee.add(fixedGasUUSD);
    }
  }, [assetAmount, tax]);

  const estimatedAmount = useMemo(() => {
    return assetAmount.length > 0 && txFee
      ? big(assetAmount).mul(MICRO).plus(txFee)
      : undefined;
  }, [assetAmount, txFee]);

  const recommendationAssetAmount = useMemo<string | undefined>(() => {
    if (bank.status === 'demo' || big(bank.userBalances.uUSD).lte(0)) {
      return undefined;
    }

    return big(bank.userBalances.uUSD).minus(fixedGasUUSD).toString();
  }, [bank.status, bank.userBalances.uUSD]);

  const tooMuchAssetAmountWarning = useMemo<ReactNode>(() => {
    if (
      bank.status === 'demo' ||
      assetAmount.length === 0 ||
      !!invalidAssetAmount
    ) {
      return undefined;
    }

    const remainUUSD = big(bank.userBalances.uUSD).minus(
      big(assetAmount).mul(MICRO),
    );

    if (remainUUSD.lt(fixedGasUUSD)) {
      return `You may run out of USD balance needed for future transactions.`;
    }

    return undefined;
  }, [assetAmount, bank.status, bank.userBalances.uUSD, invalidAssetAmount]);

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
      confirm,
    }: {
      status: WalletStatus;
      assetAmount: string;
      confirm: ReactNode;
    }) => {
      if (status.status !== 'ready' || bank.status !== 'connected') {
        return;
      }

      if (confirm) {
        const userConfirm = await openConfirm({
          title: 'Confirm',
          description: confirm,
        });

        if (!userConfirm) {
          return;
        }
      }

      const data = await queryDeposit({
        post: post<CreateTxOptions, StringifiedTxResult>({
          ...transactionFee,
          msgs: fabricateDepositStableCoin({
            address: status.status === 'ready' ? status.walletAddress : '',
            amount: assetAmount,
            symbol: 'usd',
          })(addressProvider),
        }).then(({ payload }) => parseResult(payload)),
        client,
      });

      if (data) {
        closeDialog();
      }
    },
    [
      addressProvider,
      bank.status,
      client,
      closeDialog,
      openConfirm,
      post,
      queryDeposit,
    ],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    depositResult?.status === 'in-progress' ||
    depositResult?.status === 'done' ||
    depositResult?.status === 'error'
  ) {
    return (
      <Modal open disableBackdropClick>
        <Dialog className={className}>
          <h1>Deposit</h1>
          <TxResultRenderer
            result={depositResult}
            resetResult={() => {
              resetDepositResult && resetDepositResult();
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
        <h1>Deposit</h1>

        {!!invalidTxFee && <WarningArticle>{invalidTxFee}</WarningArticle>}

        <NumberInput
          className="amount"
          value={assetAmount}
          maxDecimalPoints={UST_INPUT_MAXIMUM_DECIMAL_POINTS}
          label="AMOUNT"
          error={!!invalidAssetAmount}
          onChange={({ target }) => updateAssetAmount(target.value)}
          InputProps={{
            endAdornment: <InputAdornment position="end">UST</InputAdornment>,
          }}
        />

        <div className="wallet" aria-invalid={!!invalidAssetAmount}>
          <span>{invalidAssetAmount}</span>
          <span>
            Wallet:{' '}
            <span
              style={
                recommendationAssetAmount
                  ? {
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    }
                  : undefined
              }
              onClick={() =>
                recommendationAssetAmount &&
                updateAssetAmount(
                  big(recommendationAssetAmount).div(MICRO).toString(),
                )
              }
            >
              {formatUST(big(bank.userBalances.uUSD ?? 0).div(MICRO))} UST
            </span>
          </span>
        </div>

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
              {formatUST(big(txFee).div(MICRO))} UST
            </TxFeeListItem>
            <TxFeeListItem label="Estimated Amount">
              {formatUST(estimatedAmount.div(MICRO))} UST
            </TxFeeListItem>
          </TxFeeList>
        )}

        {tooMuchAssetAmountWarning && recommendationAssetAmount && (
          <WarningArticle>
            <p style={{ marginBottom: 10 }}>{tooMuchAssetAmountWarning}</p>

            <button
              onClick={() =>
                updateAssetAmount(
                  big(recommendationAssetAmount).div(MICRO).toString(),
                )
              }
            >
              Set recommend amount
            </button>
          </WarningArticle>
        )}

        <ActionButton
          className="proceed"
          style={
            tooMuchAssetAmountWarning
              ? {
                  backgroundColor: '#f5356a',
                }
              : undefined
          }
          disabled={
            status.status !== 'ready' ||
            bank.status !== 'connected' ||
            assetAmount.length === 0 ||
            big(assetAmount).lte(0) ||
            !!invalidAssetAmount
          }
          onClick={() =>
            proceed({
              assetAmount,
              status,
              confirm: tooMuchAssetAmountWarning,
            })
          }
        >
          Proceed
        </ActionButton>

        {confirmElement}
      </Dialog>
    </Modal>
  );
}

const depositQueryOptions: BroadcastableQueryOptions<
  { post: Promise<TxResult>; client: ApolloClient<any> },
  { txResult: TxResult } & { txInfos: txi.Data },
  Error
> = {
  ...queryOptions,
  group: 'earn/deposit',
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
  }

  .receipt {
    margin-top: 30px;
  }

  .proceed {
    margin-top: 45px;

    width: 100%;
    height: 60px;
    border-radius: 30px;
  }
`;
