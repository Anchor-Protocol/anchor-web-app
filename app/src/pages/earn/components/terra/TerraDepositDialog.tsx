import { u, UST } from '@anchor-protocol/types';
import { useEarnDepositForm } from '@anchor-protocol/app-provider';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { useConfirm } from '@libs/neumorphism-ui/components/useConfirm';
import { BigSource } from 'big.js';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import type { ReactNode } from 'react';
import React, { useCallback } from 'react';
import { useAccount } from 'contexts/account';
import { useEarnDepositTx } from '@anchor-protocol/app-provider/tx/earn/deposit';
import { DepositDialog } from '../DepositDialog';
import { DialogProps } from '@libs/use-dialog';

export function TerraDepositDialog(props: DialogProps<{}, void>) {
  const account = useAccount();

  const [openConfirm, confirmElement] = useConfirm();

  const state = useEarnDepositForm();

  const [deposit, depositTxResult] = useEarnDepositTx();

  const { depositAmount, txFee, invalidNextTxFee, availablePost } = state;

  const proceed = useCallback(
    async (
      depositAmount: UST,
      txFee: u<UST<BigSource>> | undefined,
      confirm: ReactNode,
    ) => {
      if (!account.connected || !deposit) {
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
        txFee: txFee!.toString() as u<UST>,
      });
    },
    [account.connected, deposit, openConfirm],
  );

  return (
    <DepositDialog {...props} {...state} txResult={depositTxResult}>
      <>
        <ViewAddressWarning>
          <ActionButton
            className="button"
            style={
              invalidNextTxFee
                ? {
                    backgroundColor: '#c12535',
                  }
                : undefined
            }
            disabled={
              !account.connected ||
              !account.availablePost ||
              !deposit ||
              !availablePost
            }
            onClick={() => proceed(depositAmount, txFee, invalidNextTxFee)}
          >
            Proceed
          </ActionButton>
        </ViewAddressWarning>
        {confirmElement}
      </>
    </DepositDialog>
  );
}
