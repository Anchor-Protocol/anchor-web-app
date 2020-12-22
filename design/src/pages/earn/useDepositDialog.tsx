import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { Dialog } from '@anchor-protocol/neumorphism-ui/components/Dialog';
import { TextInput } from '@anchor-protocol/neumorphism-ui/components/TextInput';
import { Tooltip } from '@anchor-protocol/neumorphism-ui/components/Tooltip';
import type { DialogProps, DialogTemplate, OpenDialog } from '@anchor-protocol/use-dialog';
import { useDialog } from '@anchor-protocol/use-dialog';
import { InputAdornment, Modal } from '@material-ui/core';
import { Warning } from '@material-ui/icons';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
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
  const [amount, setAmount] = useState('');
  const [wallet, setWallet] = useState(8390.38);

  const errorText = useMemo<string | undefined>(() => {
    return parseInt(amount) > wallet ? 'Insufficient balance' : undefined;
  }, [amount, wallet]);

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

        <p className="wallet">Wallet: {wallet} UST</p>

        <ActionButton
          className="proceed"
          disabled={amount.length === 0 || !!errorText}
        >
          Proceed
        </ActionButton>

        <p className="description">Deposit from bank</p>
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

  .description {
    text-align: center;

    font-size: 15px;
    color: ${({ theme }) => theme.dimTextColor};
  }
`;
