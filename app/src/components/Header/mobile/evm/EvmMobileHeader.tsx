import { useEvmWallet } from '@libs/evm-wallet';
import { useAccount } from 'contexts/account';
import React, { useCallback, useState } from 'react';
import { useWalletDialog } from './useWalletDialog';
import { MobileHeader } from '../MobileHeader';

export function EvmMobileHeader() {
  const [open, setOpen] = useState<boolean>(false);
  const { status } = useAccount();
  const { actions } = useEvmWallet();
  const [openWalletDialog, walletDialogElement] = useWalletDialog();

  const toggleWallet = useCallback(() => {
    if (status === 'connected') {
      openWalletDialog({});
    } else if (status === 'disconnected') {
      actions.activate('WALLETCONNECT');
    }
  }, [actions, openWalletDialog, status]);

  // const viewAddress = useCallback(() => {
  //   setOpen(false);
  //
  //   if (status === 'disconnected') {
  //     connect(ConnectType.READONLY);
  //   }
  // }, [connect, status]);

  return (
    <>
      <MobileHeader
        open={open}
        setOpen={setOpen}
        isActive={!!walletDialogElement}
        // viewAddressButtonElement={
        //   status === WalletStatus.WALLET_NOT_CONNECTED && (
        //     <ViewAddressButton onClick={viewAddress} />
        //   )
        // }
        toggleWallet={toggleWallet}
      />
      {walletDialogElement}
    </>
  );
}
