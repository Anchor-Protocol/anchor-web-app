import React, { useCallback, useMemo, useState } from 'react';
import {
  ConnectType,
  useWallet,
  WalletStatus,
} from '@terra-money/wallet-provider';
import { useBuyUstDialog } from 'pages/earn/components/useBuyUstDialog';
import { useSendDialog } from 'pages/send/useSendDialog';
import { useWalletDetailDialog } from './mobile/useWalletDetailDialog';
import { ViewAddressButton } from './mobile/ViewAddressButton';
import { MobileHeader } from './MobileHeader';
import { useAirdropElement } from './airdrop';

export function TerraMobileHeader() {
  const [open, setOpen] = useState<boolean>(false);
  const { status, connect, isChromeExtensionCompatibleBrowser } = useWallet();
  const [openWalletDetail, walletDetailElement] = useWalletDetailDialog();
  const [openSendDialog, sendDialogElement] = useSendDialog();
  const [openBuyUstDialog, buyUstDialogElement] = useBuyUstDialog();

  const toggleWallet = useCallback(() => {
    if (status === WalletStatus.WALLET_CONNECTED) {
      openWalletDetail({
        openSend: () => openSendDialog({}),
        openBuyUst: () => openBuyUstDialog({}),
      });
    } else if (status === WalletStatus.WALLET_NOT_CONNECTED) {
      connect(
        isChromeExtensionCompatibleBrowser()
          ? ConnectType.EXTENSION
          : ConnectType.WALLETCONNECT,
      );
    }
  }, [
    connect,
    isChromeExtensionCompatibleBrowser,
    openBuyUstDialog,
    openSendDialog,
    openWalletDetail,
    status,
  ]);

  const airdropElement = useAirdropElement(open);

  const viewAddress = useCallback(() => {
    setOpen(false);

    if (status === WalletStatus.WALLET_NOT_CONNECTED) {
      connect(ConnectType.READONLY);
    }
  }, [connect, status]);

  const viewAddressButtonElement = useMemo(() => {
    return (
      status === WalletStatus.WALLET_NOT_CONNECTED && (
        <ViewAddressButton onClick={viewAddress} />
      )
    );
  }, [status, viewAddress]);

  return (
    <>
      <MobileHeader
        open={open}
        setOpen={setOpen}
        isActive={!!walletDetailElement}
        toggleWallet={toggleWallet}
        airdropElement={airdropElement}
        viewAddressButtonElement={viewAddressButtonElement}
      />
      {walletDetailElement}
      {sendDialogElement}
      {buyUstDialogElement}
    </>
  );
}
