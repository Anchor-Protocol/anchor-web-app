import React from 'react';
import { useEarnDepositForm } from '@anchor-protocol/app-provider';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { useAccount } from 'contexts/account';
import { DepositDialog } from '../DepositDialog';
import { DialogProps } from '@libs/use-dialog';
import { useDepositUstTx } from 'tx/evm';
import { Container } from 'components/primitives/Container';
import { EvmTxResultRenderer } from 'components/tx/EvmTxResultRenderer';

export function EvmDepositDialog(props: DialogProps<{}, void>) {
  const account = useAccount();

  const state = useEarnDepositForm();

  const { depositAmount, availablePost } = state;

  const depositUstTx = useDepositUstTx();
  const [deposit, depositTxResult] = depositUstTx?.stream ?? [null, null];
  const { isTxMinimizable } = depositUstTx?.utils ?? {};

  return (
    <DepositDialog
      {...props}
      {...state}
      txResult={depositTxResult}
      renderBroadcastTxResult={
        <EvmTxResultRenderer
          onExit={props.closeDialog}
          txStreamResult={depositTxResult}
          minimizable={isTxMinimizable}
        />
      }
    >
      <>
        <Container direction="row" gap={10}>
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
        </Container>
      </>
    </DepositDialog>
  );
}
