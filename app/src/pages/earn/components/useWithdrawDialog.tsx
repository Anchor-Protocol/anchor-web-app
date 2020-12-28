import { fabricateDepositStableCoin } from '@anchor-protocol/anchor-js/fabricators';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { Dialog } from '@anchor-protocol/neumorphism-ui/components/Dialog';
import { TextInput } from '@anchor-protocol/neumorphism-ui/components/TextInput';
import { Tooltip } from '@anchor-protocol/neumorphism-ui/components/Tooltip';
import type {
  DialogProps,
  DialogTemplate,
  OpenDialog,
} from '@anchor-protocol/use-dialog';
import { useDialog } from '@anchor-protocol/use-dialog';
import { InputAdornment, Modal } from '@material-ui/core';
import { Warning } from '@material-ui/icons';
import { ActionContainer, ActionExecute } from 'containers/action';
import useWalletBalance from 'hooks/mantle/use-wallet-balance';
import { useWallet } from 'hooks/use-wallet';
import type { ReactNode } from 'react';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

interface FormParams {
  className?: string;
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
}: DialogProps<FormParams, FormReturn>) {
  const { address } = useWallet();
  const [loading, error, balance] = useWalletBalance();

  const [amount, setAmount] = useState('');

  const ustBalance = useMemo<number>(() => {
    return (
      +(balance?.find(({ Denom }) => Denom === 'uusd')?.Amount ?? 0) / 1000000
    );
  }, [balance]);

  const errorText = useMemo<string | undefined>(() => {
    return parseFloat(amount) > ustBalance ? 'Insufficient balance' : undefined;
  }, [amount, ustBalance]);

  const proceed = useCallback(
    async (execute: ActionExecute) => {
      try {
        await execute(
          fabricateDepositStableCoin({
            address,
            amount: +amount,
            symbol: 'usd',
          }),
        );
        closeDialog();
      } catch (error) {
        console.error(error);
      }
    },
    [address, amount, closeDialog],
  );

  console.log('useDepositDialog.tsx..ComponentBase()', { error, loading });

  return (
    <Modal open disableBackdropClick>
      <Dialog className={className} onClose={() => closeDialog()}>
        <h1>Deposit</h1>

        <TextInput
          className="amount"
          type="number"
          value={amount}
          label="AMOUNT"
          onChange={({ target }) => setAmount(target.value)}
          InputProps={{
            endAdornment: !!errorText ? (
              <Tooltip open color="error" title={errorText} placement="right">
                <Warning />
              </Tooltip>
            ) : (
              <InputAdornment position="end">UST</InputAdornment>
            ),
            inputMode: 'numeric',
          }}
          error={!!errorText}
        />

        <p className="wallet">Wallet: {ustBalance} UST</p>

        <ActionContainer
          render={(execute) => (
            <ActionButton
              className="proceed"
              disabled={amount.length === 0 || +amount > 0.0 || !!errorText}
              onClick={() => proceed(execute)}
            >
              Proceed
            </ActionButton>
          )}
        />
      </Dialog>
    </Modal>
  );
}

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
