import { fabricateRedeemStable } from '@anchor-protocol/anchor-js/fabricators';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { Dialog } from '@anchor-protocol/neumorphism-ui/components/Dialog';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { NumberInput } from '@anchor-protocol/neumorphism-ui/components/NumberInput';
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
import * as txi from 'queries/txInfos';
import { queryOptions } from 'transactions/queryOptions';
import { parseResult, StringifiedTxResult, TxResult } from 'transactions/tx';
import {
  txNotificationFactory,
  TxResultRenderer,
} from 'components/TxResultRenderer';
import big from 'big.js';
import { InfoTooltip } from '@anchor-protocol/neumorphism-ui/components/InfoTooltip';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { WarningArticle } from 'components/WarningArticle';
import { useBank } from 'contexts/bank';
import { useAddressProvider } from 'contexts/contract';
import { fixedGasUUSD, transactionFee } from 'env';
import type { ReactNode } from 'react';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Data as TotalDepositData } from '../queries/totalDeposit';

interface FormParams {
  className?: string;
  totalDeposit: TotalDepositData;
}

type FormReturn = void;

export function useWithdrawDialog(): [
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
  totalDeposit,
}: DialogProps<FormParams, FormReturn>) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { status, post } = useWallet();

  const addressProvider = useAddressProvider();

  const [
    fetchWithdraw,
    withdrawResult,
    resetWithdrawResult,
  ] = useBroadcastableQuery(withdrawQueryOptions);

  const client = useApolloClient();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [aAssetAmount, setAAssetAmount] = useState<string>('');

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

  const invalidAAsetAmount = useMemo<ReactNode>(() => {
    if (bank.status === 'demo' || aAssetAmount.length === 0) {
      return undefined;
    } else if (
      big(aAssetAmount)
        .mul(MICRO)
        .gt(totalDeposit.totalDeposit ?? 0)
    ) {
      return `Not enough aUST`;
    }
    return undefined;
  }, [aAssetAmount, bank.status, totalDeposit.totalDeposit]);

  const txFee = useMemo(() => {
    if (aAssetAmount.length === 0) return undefined;

    // MIN((Withdrawable(User_input)- Withdrawable(User_input) / (1+Tax_rate)), Max_tax) + Fixed_Gas

    const uustAmount = big(aAssetAmount).mul(MICRO);
    const ratioTxFee = uustAmount.minus(
      uustAmount.div(big(1).add(bank.tax.taxRate)),
    );
    const maxTax = big(bank.tax.maxTaxUUSD);

    if (ratioTxFee.gt(maxTax)) {
      return maxTax.add(fixedGasUUSD).toString();
    } else {
      return ratioTxFee.add(fixedGasUUSD).toString();
    }
  }, [aAssetAmount, bank.tax.maxTaxUUSD, bank.tax.taxRate]);

  const receiveAmount = useMemo(() => {
    return aAssetAmount.length > 0 && txFee
      ? big(aAssetAmount).mul(MICRO).minus(txFee)
      : undefined;
  }, [aAssetAmount, txFee]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const updateAAssetAmount = useCallback((nextAAssetAmount: string) => {
    setAAssetAmount(nextAAssetAmount);
  }, []);

  const proceed = useCallback(
    async ({
      status,
      aAssetAmount,
    }: {
      status: WalletStatus;
      aAssetAmount: string;
    }) => {
      if (status.status !== 'ready' || bank.status !== 'connected') {
        return;
      }

      const data = await fetchWithdraw({
        post: post<CreateTxOptions, StringifiedTxResult>({
          ...transactionFee,
          msgs: fabricateRedeemStable({
            address: status.status === 'ready' ? status.walletAddress : '',
            amount: big(aAssetAmount)
              .div(totalDeposit.exchangeRate.exchange_rate)
              .toString(),
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
      fetchWithdraw,
      post,
      totalDeposit.exchangeRate.exchange_rate,
    ],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    withdrawResult?.status === 'in-progress' ||
    withdrawResult?.status === 'done' ||
    withdrawResult?.status === 'error'
  ) {
    return (
      <Modal open disableBackdropClick>
        <Dialog className={className}>
          <h1>Withdraw</h1>
          <TxResultRenderer
            result={withdrawResult}
            resetResult={() => {
              resetWithdrawResult && resetWithdrawResult();
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
        <h1>Withdraw</h1>

        {!!invalidTxFee && <WarningArticle>{invalidTxFee}</WarningArticle>}

        <NumberInput
          className="amount"
          value={aAssetAmount}
          maxIntegerPoinsts={UST_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={UST_INPUT_MAXIMUM_DECIMAL_POINTS}
          label="AMOUNT"
          error={!!invalidAAsetAmount}
          onChange={({ target }) => updateAAssetAmount(target.value)}
          InputProps={{
            endAdornment: <InputAdornment position="end">UST</InputAdornment>,
          }}
        />

        <div className="wallet" aria-invalid={!!invalidAAsetAmount}>
          <span>{invalidAAsetAmount}</span>
          <span>
            Wallet:{' '}
            <span
              style={{
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
              onClick={() =>
                updateAAssetAmount(
                  formatUSTInput(big(totalDeposit.totalDeposit).div(MICRO)),
                )
              }
            >
              {formatUST(big(totalDeposit.totalDeposit).div(MICRO))} UST
            </span>
          </span>
        </div>

        {txFee && receiveAmount && (
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
            <TxFeeListItem label="Receive Amount">
              {formatUST(receiveAmount.div(MICRO))} UST
            </TxFeeListItem>
          </TxFeeList>
        )}

        <ActionButton
          className="proceed"
          disabled={
            status.status !== 'ready' ||
            bank.status !== 'connected' ||
            aAssetAmount.length === 0 ||
            big(aAssetAmount).lte(0) ||
            !!invalidAAsetAmount
          }
          onClick={() =>
            proceed({
              aAssetAmount,
              status,
            })
          }
        >
          Proceed
        </ActionButton>
      </Dialog>
    </Modal>
  );
}

const withdrawQueryOptions: BroadcastableQueryOptions<
  { post: Promise<TxResult>; client: ApolloClient<any> },
  { txResult: TxResult } & { txInfos: txi.Data },
  Error
> = {
  ...queryOptions,
  group: 'earn/withdraw',
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
    margin-top: 65px;

    width: 100%;
    height: 60px;
    border-radius: 30px;
  }
`;
