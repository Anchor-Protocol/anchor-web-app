import { useEvmWallet } from '@libs/evm-wallet';
import { useAccount } from 'contexts/account';
import { useBuyUstDialog } from 'pages/earn/components/useBuyUstDialog';
import { useSendDialog } from 'pages/send/useSendDialog';
import React, { useCallback, useState } from 'react';
import { useWalletDetailDialog } from '../mobile/useWalletDetailDialog';
import { CommonMobileHeader } from './CommonMobileHeader';

export function EvmMobileHeader() {
  const [open, setOpen] = useState<boolean>(false);
  const { status } = useAccount();
  const { actions } = useEvmWallet();
  const [openWalletDetail, walletDetailElement] = useWalletDetailDialog();
  const [openSendDialog, sendDialogElement] = useSendDialog();
  const [openBuyUstDialog, buyUstDialogElement] = useBuyUstDialog();

  const toggleWallet = useCallback(() => {
    if (status === 'connected') {
      // TODO
      console.info(openWalletDetail, openSendDialog, openBuyUstDialog);
      // openWalletDetail({
      //   openSend: () => openSendDialog({}),
      //   openBuyUst: () => openBuyUstDialog({}),
      // });
    } else if (status === 'disconnected') {
      actions.activate('WALLETCONNECT');
    }
  }, [actions, openBuyUstDialog, openSendDialog, openWalletDetail, status]);

  // const viewAddress = useCallback(() => {
  //   setOpen(false);
  //
  //   if (status === 'disconnected') {
  //     connect(ConnectType.READONLY);
  //   }
  // }, [connect, status]);

  return (
    <>
      <CommonMobileHeader
        open={open}
        setOpen={setOpen}
        isActive={!!walletDetailElement}
        // viewAddressButtonElement={
        //   status === WalletStatus.WALLET_NOT_CONNECTED && (
        //     <ViewAddressButton onClick={viewAddress} />
        //   )
        // }
        toggleWallet={toggleWallet}
      />
      {walletDetailElement}
      {sendDialogElement}
      {buyUstDialogElement}
    </>
  );
}
