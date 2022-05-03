import { UST } from '@anchor-protocol/types';
import { useEarnDepositForm } from '@anchor-protocol/app-provider';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { useConfirm } from '@libs/neumorphism-ui/components/useConfirm';
import { ViewAddressWarning } from 'components/ViewAddressWarning';
import type { ReactNode } from 'react';
import React, { useCallback } from 'react';
import { useAccount } from 'contexts/account';
import { DepositDialog } from '../DepositDialog';
import { DialogProps } from '@libs/use-dialog';
import { useDepositUstTx } from 'tx/terra';

export function TerraDepositDialog(props: DialogProps<{}, void>) {
  const account = useAccount();

  const [openConfirm, confirmElement] = useConfirm();

  const state = useEarnDepositForm();

  const { depositAmount, invalidNextTxFee, availablePost } = state;

  const [deposit, depositTxResult] = useDepositUstTx();

  const proceed = useCallback(
    async (depositAmount: UST, confirm: ReactNode) => {
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
            onClick={() => proceed(depositAmount, invalidNextTxFee)}
          >
            Proceed
          </ActionButton>
        </ViewAddressWarning>
        {confirmElement}
      </>
    </DepositDialog>
  );
}
