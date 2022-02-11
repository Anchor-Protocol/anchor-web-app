import { UST } from '@anchor-protocol/types';
import { useApproveUstTx, useDepositTx } from '@libs/evm-tx';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import type { DialogProps } from '@libs/use-dialog';
import { Modal } from '@material-ui/core';
import { StreamStatus } from '@rx-stream/react';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { CommonDepositDialog } from './CommonDepositDialog';
import { FormParams, FormReturn } from './types';

function EvmDepositDialogBase({
  className,
  closeDialog,
}: DialogProps<FormParams, FormReturn>) {
  const [approveUstTx, approveUstTxResult] = useApproveUstTx();
  const [depositTx, depositTxResult] = useDepositTx();
  console.log('> approveUstTxResult', approveUstTxResult);
  console.log('> depositTxResult', depositTxResult);

  const proceed = useCallback(
    (depositAmount: UST) => depositTx?.({ depositAmount }),
    [depositTx],
  );

  if (
    approveUstTxResult?.status === StreamStatus.IN_PROGRESS ||
    approveUstTxResult?.status === StreamStatus.DONE
  ) {
    return (
      <Modal open disableBackdropClick disableEnforceFocus>
        <Dialog className={className}>
          <TxResultRenderer
            resultRendering={approveUstTxResult.value}
            onExit={closeDialog}
          />
        </Dialog>
      </Modal>
    );
  }

  if (
    depositTxResult?.status === StreamStatus.IN_PROGRESS ||
    depositTxResult?.status === StreamStatus.DONE
  ) {
    return (
      <Modal open disableBackdropClick disableEnforceFocus>
        <Dialog className={className}>
          <TxResultRenderer
            resultRendering={depositTxResult.value}
            onExit={closeDialog}
          />
        </Dialog>
      </Modal>
    );
  }

  return (
    <CommonDepositDialog className={className} closeDialog={closeDialog}>
      {(isHighlighted, isValid, submitDeposit) => (
        <>
          <ActionButton
            className="proceed"
            style={isHighlighted ? { backgroundColor: '#c12535' } : undefined}
            disabled={!isValid}
            onClick={approveUstTx}
          >
            Approve UST
          </ActionButton>
          <ActionButton
            className="proceed"
            style={isHighlighted ? { backgroundColor: '#c12535' } : undefined}
            disabled={!isValid}
            onClick={() => submitDeposit(proceed)}
          >
            Proceed
          </ActionButton>
        </>
      )}
    </CommonDepositDialog>
  );
}

export const EvmDepositDialog = styled(EvmDepositDialogBase)`
  width: 720px;

  .proceed {
    margin-top: 45px;
    width: 100%;
    height: 60px;
    border-radius: 30px;
  }
`;
