import React, { useCallback, useState } from 'react';
import { useWalletDialog } from './useWalletDialog';
import { MobileHeader } from '../MobileHeader';

export function EvmMobileHeader() {
  const [open, setOpen] = useState<boolean>(false);
  const [openWalletDialog, walletDialogElement] = useWalletDialog();

  const toggleWallet = useCallback(() => {
    openWalletDialog({});
  }, [openWalletDialog]);

  return (
    <>
      <MobileHeader
        open={open}
        setOpen={setOpen}
        isActive={!!walletDialogElement}
        toggleWallet={toggleWallet}
      />
      {walletDialogElement}
    </>
  );
}
