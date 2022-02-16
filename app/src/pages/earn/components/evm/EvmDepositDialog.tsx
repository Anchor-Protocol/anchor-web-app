import { useEarnDepositForm } from '@anchor-protocol/app-provider';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import React from 'react';
import { useAccount } from 'contexts/account';
import { DepositDialog } from '../DepositDialog';
import { StreamStatus } from '@rx-stream/react';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { DialogProps } from '@libs/use-dialog';
import { Modal } from '@material-ui/core';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { useApproveUstTx, useDepositUstTx } from 'tx/evm';

export function EvmDepositDialog(props: DialogProps<{}, void>) {
  const account = useAccount();

  const state = useEarnDepositForm();

  const { depositAmount, availablePost } = state;

  const [approve, approveTxResult] = useApproveUstTx();

  const [deposit, depositTxResult] = useDepositUstTx();

  return (
    <DepositDialog {...props} {...state} txResult={depositTxResult}>
      <>
        <ViewAddressWarning>
          <ActionButton
            className="button"
            disabled={
              !account.connected ||
              !account.availablePost ||
              !approve ||
              !availablePost
            }
            onClick={approve}
          >
            Approve
          </ActionButton>
          <ActionButton
            className="button"
            disabled={
              !account.connected ||
              !account.availablePost ||
              !deposit ||
              !availablePost
            }
            onClick={() =>
              deposit!({
                depositAmount,
              })
            }
          >
            Proceed
          </ActionButton>
        </ViewAddressWarning>

        {approveTxResult?.status === StreamStatus.IN_PROGRESS && (
          <Modal open disableBackdropClick disableEnforceFocus>
            <Dialog>
              <TxResultRenderer resultRendering={approveTxResult.value} />
            </Dialog>
          </Modal>
        )}
      </>
    </DepositDialog>
  );
}
