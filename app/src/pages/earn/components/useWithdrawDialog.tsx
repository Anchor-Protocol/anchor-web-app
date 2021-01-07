import { fabricateRedeemStable } from '@anchor-protocol/anchor-js/fabricators';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { Dialog } from '@anchor-protocol/neumorphism-ui/components/Dialog';
import { TextInput } from '@anchor-protocol/neumorphism-ui/components/TextInput';
import { Tooltip } from '@anchor-protocol/neumorphism-ui/components/Tooltip';
import { MICRO, toFixedNoRounding } from '@anchor-protocol/number-notation';
import { BroadcastableQueryOptions, useBroadcastableQuery } from '@anchor-protocol/use-broadcastable-query';
import type { DialogProps, DialogTemplate, OpenDialog } from '@anchor-protocol/use-dialog';
import { useDialog } from '@anchor-protocol/use-dialog';
import { useWallet } from '@anchor-protocol/wallet-provider';
import { ApolloClient, useApolloClient, useQuery } from '@apollo/client';
import { InputAdornment, Modal } from '@material-ui/core';
import { Warning } from '@material-ui/icons';
import { CreateTxOptions } from '@terra-money/terra.js';
import big from 'big.js';
import { transactionFee } from 'env';
import { useAddressProvider } from 'providers/address-provider';
import * as txi from 'queries/txInfos';
import * as bal from 'queries/userBankBalances';
import type { ReactNode } from 'react';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { queryOptions } from 'transactions/queryOptions';
import { parseResult, StringifiedTxResult, TxResult } from 'transactions/tx';
import { txNotificationFactory, TxResultRenderer } from 'transactions/TxResultRenderer';

interface FormParams {
  className?: string;
}

interface FormReturn {
  refresh: boolean;
}

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
  const [amount, setAmount] = useState<string>('');

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const { data: userBankBalancesData } = useQuery<
    bal.StringifiedData,
    bal.StringifiedVariables
  >(bal.query, {
    skip: status.status !== 'ready',
    variables: bal.stringifyVariables({
      userAddress: status.status === 'ready' ? status.walletAddress : '',
    }),
  });

  const userUusdBalance = useMemo(() => {
    return userBankBalancesData
      ? bal.parseData(userBankBalancesData).get('uusd')?.Amount
      : undefined;
  }, [userBankBalancesData]);

  // ---------------------------------------------
  // compute
  // ---------------------------------------------
  const amountInputError = useMemo<ReactNode>(() => {
    if (
      big(amount.length > 0 ? amount : 0)
        .mul(MICRO)
        .gt(big(userUusdBalance ?? 0))
    ) {
      return `Insufficient balance: Not enough Assets (${big(
        userUusdBalance ?? 0,
      ).div(MICRO)} UST)`;
    }
    return undefined;
  }, [amount, userUusdBalance]);

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
          <h1>Deposit</h1>
          <TxResultRenderer
            result={withdrawResult}
            resetResult={() => {
              resetWithdrawResult && resetWithdrawResult();
              closeDialog({ refresh: true });
            }}
          />
        </Dialog>
      </Modal>
    );
  }

  return (
    <Modal open disableBackdropClick>
      <Dialog
        className={className}
        onClose={() => closeDialog({ refresh: false })}
      >
        <h1>Deposit</h1>

        <TextInput
          className="amount"
          type="number"
          value={amount}
          label="AMOUNT"
          onChange={({ target }) => setAmount(target.value)}
          InputProps={{
            endAdornment: !!amountInputError ? (
              <Tooltip
                open
                color="error"
                title={amountInputError}
                placement="right"
              >
                <Warning />
              </Tooltip>
            ) : (
              <InputAdornment position="end">UST</InputAdornment>
            ),
            inputMode: 'numeric',
          }}
          error={!!amountInputError}
        />

        <p className="wallet">
          Wallet:{' '}
          {toFixedNoRounding(
            big(userUusdBalance ?? 0)
              .div(MICRO)
              .toString(),
            2,
          )}{' '}
          UST
        </p>

        <ActionButton
          className="proceed"
          disabled={
            status.status !== 'ready' ||
            amount.length === 0 ||
            big(amount).lte(0) ||
            !!amountInputError
          }
          onClick={() =>
            fetchWithdraw({
              post: post<CreateTxOptions, StringifiedTxResult>({
                ...transactionFee,
                msgs: fabricateRedeemStable({
                  address:
                    status.status === 'ready' ? status.walletAddress : '',
                  amount: big(amount).toNumber(),
                  symbol: 'usd',
                })(addressProvider),
              }).then(({ payload }) => parseResult(payload)),
              client,
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
  height: 455px;

  h1 {
    font-size: 27px;
    text-align: center;
    font-weight: 300;

    margin-bottom: 50px;
  }

  .amount {
    width: 100%;
    margin-bottom: 5px;
  }

  .wallet {
    text-align: right;

    font-size: 12px;
    color: ${({ theme }) => theme.dimTextColor};

    margin-bottom: 65px;
  }

  .proceed {
    width: 100%;
    height: 60px;
    border-radius: 30px;

    margin-bottom: 25px;
  }
`;
