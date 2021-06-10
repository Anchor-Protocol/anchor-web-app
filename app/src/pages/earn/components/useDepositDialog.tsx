import {
  demicrofy,
  formatUST,
  formatUSTInput,
  UST_INPUT_MAXIMUM_DECIMAL_POINTS,
  UST_INPUT_MAXIMUM_INTEGER_POINTS,
} from '@anchor-protocol/notation';
import { UST, uUST } from '@anchor-protocol/types';
import {
  useEarnDepositForm,
  useEarnDepositTx,
} from '@anchor-protocol/webapp-provider';
import { InputAdornment, Modal } from '@material-ui/core';
import { StreamStatus } from '@rx-stream/react';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { Dialog } from '@terra-dev/neumorphism-ui/components/Dialog';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { NumberInput } from '@terra-dev/neumorphism-ui/components/NumberInput';
import { useConfirm } from '@terra-dev/neumorphism-ui/components/useConfirm';
import type { DialogProps, OpenDialog } from '@terra-dev/use-dialog';
import { useDialog } from '@terra-dev/use-dialog';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { BigSource } from 'big.js';
import { MessageBox } from 'components/MessageBox';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { TxResultRenderer } from 'components/TxResultRenderer';
import type { ReactNode } from 'react';
import React, { ChangeEvent, useCallback } from 'react';
import styled from 'styled-components';

interface FormParams {
  className?: string;
}

type FormReturn = void;

export function useDepositDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog(Component);
}

function ComponentBase({
  className,
  closeDialog,
}: DialogProps<FormParams, FormReturn>) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

  const [openConfirm, confirmElement] = useConfirm();

  const [deposit, depositResult] = useEarnDepositTx();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const {
    depositAmount,
    txFee,
    sendAmount,
    maxAmount,
    invalidTxFee,
    invalidNextTxFee,
    invalidDepositAmount,
    updateDepositAmount,
    availablePost,
  } = useEarnDepositForm();

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const proceed = useCallback(
    async (
      depositAmount: UST,
      txFee: uUST<BigSource> | undefined,
      confirm: ReactNode,
    ) => {
      if (!connectedWallet || !deposit) {
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

      deposit({
        depositAmount,
        txFee: txFee!.toString() as uUST,
      });
    },
    [connectedWallet, deposit, openConfirm],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (
    depositResult?.status === StreamStatus.IN_PROGRESS ||
    depositResult?.status === StreamStatus.DONE
  ) {
    return (
      <Modal open disableBackdropClick disableEnforceFocus>
        <Dialog className={className}>
          <TxResultRenderer
            resultRendering={depositResult.value}
            onExit={closeDialog}
          />
        </Dialog>
      </Modal>
    );
  }

  return (
    <Modal open onClose={() => closeDialog()}>
      <Dialog className={className} onClose={() => closeDialog()}>
        <h1>Deposit</h1>

        {!!invalidTxFee && <MessageBox>{invalidTxFee}</MessageBox>}

        <NumberInput
          className="amount"
          value={depositAmount}
          maxIntegerPoints={UST_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={UST_INPUT_MAXIMUM_DECIMAL_POINTS}
          label="AMOUNT"
          error={!!invalidDepositAmount}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            updateDepositAmount(target.value as UST)
          }
          InputProps={{
            endAdornment: <InputAdornment position="end">UST</InputAdornment>,
          }}
        />

        <div className="wallet" aria-invalid={!!invalidDepositAmount}>
          <span>{invalidDepositAmount}</span>
          <span>
            Max:{' '}
            <span
              style={
                maxAmount
                  ? {
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    }
                  : undefined
              }
              onClick={() =>
                maxAmount &&
                updateDepositAmount(formatUSTInput(demicrofy(maxAmount)))
              }
            >
              {maxAmount ? formatUST(demicrofy(maxAmount)) : 0} UST
            </span>
          </span>
        </div>

        {txFee && sendAmount && (
          <TxFeeList className="receipt">
            <TxFeeListItem label={<IconSpan>Tx Fee</IconSpan>}>
              {formatUST(demicrofy(txFee))} UST
            </TxFeeListItem>
            <TxFeeListItem label="Send Amount">
              {formatUST(demicrofy(sendAmount))} UST
            </TxFeeListItem>
          </TxFeeList>
        )}

        {invalidNextTxFee && maxAmount && (
          <MessageBox style={{ marginTop: 30, marginBottom: 0 }}>
            {invalidNextTxFee}
          </MessageBox>
        )}

        <ActionButton
          className="proceed"
          style={
            invalidNextTxFee
              ? {
                  backgroundColor: '#c12535',
                }
              : undefined
          }
          disabled={
            !connectedWallet ||
            !connectedWallet.availablePost ||
            !deposit ||
            !availablePost
          }
          onClick={() => proceed(depositAmount, txFee, invalidNextTxFee)}
        >
          Proceed
        </ActionButton>

        {confirmElement}
      </Dialog>
    </Modal>
  );
}

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
      color: ${({ theme }) => theme.colors.negative};
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
