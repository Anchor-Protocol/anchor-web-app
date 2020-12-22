import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { Dialog } from '@anchor-protocol/neumorphism-ui/components/Dialog';
import { TextInput } from '@anchor-protocol/neumorphism-ui/components/TextInput';
import type { DialogProps, DialogTemplate, OpenDialog } from '@anchor-protocol/use-dialog';
import { useDialog } from '@anchor-protocol/use-dialog';
import { InputAdornment, Modal } from '@material-ui/core';
import type { ReactNode } from 'react';
import { useState } from 'react';
import styled from 'styled-components';

interface FormParams {
  className?: string;
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
  closeDialog,
}: DialogProps<FormParams, FormReturn>) {
  const [depositAmount, setDepositAmount] = useState('');
  const [borrowLimitUsed, setBorrowLimitUsed] = useState('');
  const [safeMax] = useState(8390.38);

  return (
    <Modal open disableBackdropClick>
      <Dialog className={className} onClose={() => closeDialog()}>
        <h1>
          Deposit
          <p>APR: 3.19%</p>
        </h1>

        <TextInput
          className="deposit-amount"
          type="number"
          value={depositAmount}
          label="DEPOSIT AMOUNT"
          onChange={({ target }) => setDepositAmount(target.value)}
          InputProps={{
            endAdornment: <InputAdornment position="end">UST</InputAdornment>,
            inputMode: 'numeric',
          }}
        />

        <p className="safe-max">Safe Max: {safeMax} UST</p>

        <TextInput
          className="borrow-limit-used"
          type="number"
          value={borrowLimitUsed}
          label="BORROW LIMIT USED"
          onChange={({ target }) => setBorrowLimitUsed(target.value)}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
            inputMode: 'numeric',
          }}
        />

        <figure></figure>

        <ActionButton
          className="proceed"
          disabled={depositAmount.length === 0 || borrowLimitUsed.length === 0}
        >
          Proceed
        </ActionButton>
      </Dialog>
    </Modal>
  );
}

const Component = styled(ComponentBase)`
  width: 720px;
  height: 578px;

  h1 {
    font-size: 27px;
    text-align: center;
    font-weight: 300;

    p {
      margin-top: 5px;
      font-size: 14px;
      color: ${({ theme }) => theme.dimTextColor};
    }

    margin-bottom: 50px;
  }

  .deposit-amount {
    width: 100%;
    margin-bottom: 5px;
  }

  .safe-max {
    text-align: right;

    font-size: 12px;
    color: ${({ theme }) => theme.dimTextColor};

    margin-bottom: 25px;
  }
  
  .borrow-limit-used {
    width: 100%;
    margin-bottom: 30px;
  }
  
  figure {
    height: 60px;
    border-radius: 20px;
    border: 2px dashed ${({theme}) => theme.textColor};
    
    margin-bottom: 30px;
  }

  .proceed {
    width: 100%;
    height: 60px;
    border-radius: 30px;
  }
`;
