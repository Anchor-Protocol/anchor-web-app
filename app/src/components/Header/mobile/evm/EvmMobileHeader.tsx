import React, { useCallback, useMemo, useState } from 'react';
import { useWalletDialog } from './useWalletDialog';
import { MobileHeader } from '../MobileHeader';
import { useAccount } from 'contexts/account';
import { ViewAddressButton } from '../ViewAddressButton';
import { useCreateEvmReadOnlyWallet } from 'components/dialogs/CreateReadOnlyWallet/evm/useCreateEvmReadOnlyWallet';

export function EvmMobileHeader() {
  const [open, setOpen] = useState<boolean>(false);

  const [createEvmReadOnlyWallet, createEvmReadOnlyWalletDialog] =
    useCreateEvmReadOnlyWallet();

  const [openWalletDialog, walletDialogElement] = useWalletDialog();
  const { status } = useAccount();

  const toggleWallet = useCallback(() => {
    openWalletDialog({ onRequestReadOnlyWallet: createEvmReadOnlyWallet });
  }, [createEvmReadOnlyWallet, openWalletDialog]);

  const viewAddress = useCallback(() => {
    setOpen(false);

    createEvmReadOnlyWallet();
  }, [createEvmReadOnlyWallet]);

  const viewAddressButtonElement = useMemo(() => {
    return (
      status === 'disconnected' && <ViewAddressButton onClick={viewAddress} />
    );
  }, [status, viewAddress]);

  return (
    <>
      <MobileHeader
        open={open}
        setOpen={setOpen}
        isActive={!!walletDialogElement}
        toggleWallet={toggleWallet}
        viewAddressButtonElement={viewAddressButtonElement}
      />
      {walletDialogElement}
      {createEvmReadOnlyWalletDialog}
    </>
  );
}
