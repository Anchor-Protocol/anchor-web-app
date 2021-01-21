import { fabricateDepositStableCoin } from '@anchor-protocol/anchor-js/fabricators';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { Dialog } from '@anchor-protocol/neumorphism-ui/components/Dialog';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@anchor-protocol/neumorphism-ui/components/InfoTooltip';
import { NumberInput } from '@anchor-protocol/neumorphism-ui/components/NumberInput';
import { useConfirm } from '@anchor-protocol/neumorphism-ui/components/useConfirm';
import {
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
import big from 'big.js';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import {
  txNotificationFactory,
  TxResultRenderer,
} from 'components/TxResultRenderer';
import { WarningArticle } from 'components/WarningArticle';
import { useBank } from 'contexts/bank';
import { useAddressProvider } from 'contexts/contract';
import { fixedGasUUSD, transactionFee } from 'env';
import * as txi from 'queries/txInfos';
import type { ReactNode } from 'react';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { queryOptions } from 'transactions/queryOptions';
import { parseResult, StringifiedTxResult, TxResult } from 'transactions/tx';

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

  // ---------------------------------------------
  // compute
  // ---------------------------------------------
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
        .gt(bank.userBalances.uUSD ?? 0)
    ) {
      return `Not enough UST`;
    }
    return undefined;
  }, [assetAmount, bank.status, bank.userBalances.uUSD]);

  const txFee = useMemo(() => {
    if (assetAmount.length === 0) return undefined;

    // MIN((User_UST_Balance - fixed_gas)/(1+Tax_rate) * tax_rate , Max_tax) + Fixed_Gas

    const uustAmount = big(assetAmount).mul(MICRO);
    const ratioTxFee = big(uustAmount.minus(fixedGasUUSD))
      .div(big(1).add(bank.tax.taxRate))
      .mul(bank.tax.taxRate);
    const maxTax = big(bank.tax.maxTaxUUSD);

    if (ratioTxFee.gt(maxTax)) {
      return maxTax.add(fixedGasUUSD);
    } else {
      return ratioTxFee.add(fixedGasUUSD);
    }
  }, [assetAmount, bank.tax.maxTaxUUSD, bank.tax.taxRate]);

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
          description: confirm,
          agree: 'Proceed',
          disagree: 'Cancel',
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
    <Modal open onClose={() => closeDialog()}>
      <Dialog className={className} onClose={() => closeDialog()}>
        <h1>Deposit</h1>

        {!!invalidTxFee && <WarningArticle>{invalidTxFee}</WarningArticle>}

        <NumberInput
          className="amount"
          value={assetAmount}
          maxIntegerPoinsts={UST_INPUT_MAXIMUM_INTEGER_POINTS}
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
                  formatUSTInput(big(recommendationAssetAmount).div(MICRO)),
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
                <IconSpan>
                  Tx Fee <InfoTooltip>Tx Fee Description</InfoTooltip>
                </IconSpan>
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
          <WarningArticle style={{ marginTop: 30, marginBottom: 0 }}>
            <p style={{ marginBottom: 10 }}>{tooMuchAssetAmountWarning}</p>

            <ActionButton
              style={{ width: '70%' }}
              onClick={() =>
                updateAssetAmount(
                  formatUSTInput(big(recommendationAssetAmount).div(MICRO)),
                )
              }
            >
              Set recommend amount
            </ActionButton>
          </WarningArticle>
        )}

        <ActionButton
          className="proceed"
          style={
            tooMuchAssetAmountWarning
              ? {
                  backgroundColor: '#c12535',
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
