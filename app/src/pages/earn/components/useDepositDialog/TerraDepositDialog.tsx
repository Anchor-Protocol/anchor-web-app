import { u, UST } from '@anchor-protocol/types';
import { useAnchorApiTx } from '@anchor-protocol/app-provider';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import type { DialogProps } from '@libs/use-dialog';
import { Modal } from '@material-ui/core';
import { StreamStatus } from '@rx-stream/react';
import { BigSource } from 'big.js';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { CommonDepositDialog } from './CommonDepositDialog';
import { FormParams, FormReturn } from './types';

function TerraDepositDialogBase({
  className,
  closeDialog,
}: DialogProps<FormParams, FormReturn>) {
  const [deposit, depositResult] = useAnchorApiTx((api) => api.deposit);

  const proceed = useCallback(
    (depositAmount: UST, txFee: u<UST<BigSource>> | undefined) =>
      deposit?.({
        depositAmount,
        txFee: txFee!.toString() as u<UST>,
      }),
    [deposit],
  );

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
    <CommonDepositDialog className={className} closeDialog={closeDialog}>
      {(isHighlighted, isValid, submitDeposit) => (
        <ActionButton
          className="proceed"
          style={isHighlighted ? { backgroundColor: '#c12535' } : undefined}
          disabled={!deposit || !isValid}
          onClick={() => submitDeposit(proceed)}
        >
          Proceed
        </ActionButton>
      )}
    </CommonDepositDialog>
  );
}

export const TerraDepositDialog = styled(TerraDepositDialogBase)`
  width: 720px;

  .proceed {
    margin-top: 45px;
    width: 100%;
    height: 60px;
    border-radius: 30px;
  }
`;
