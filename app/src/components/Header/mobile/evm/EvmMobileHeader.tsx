import React, { useCallback, useMemo, useState } from 'react';
import { useWalletDialog } from './useWalletDialog';
import { MobileHeader } from '../MobileHeader';
import { useAccount } from 'contexts/account';
import { ViewAddressButton } from '../ViewAddressButton';
import { useEvmWallet } from '@libs/evm-wallet';

export function EvmMobileHeader() {
  const [open, setOpen] = useState<boolean>(false);
  const [openWalletDialog, walletDialogElement] = useWalletDialog();
  const { status } = useAccount();
  const { requestReadOnlyConnection } = useEvmWallet();

  const toggleWallet = useCallback(() => {
    openWalletDialog({});
  }, [openWalletDialog]);

  const viewAddress = useCallback(() => {
    setOpen(false);

    requestReadOnlyConnection();
  }, [requestReadOnlyConnection]);

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
    </>
  );
}
