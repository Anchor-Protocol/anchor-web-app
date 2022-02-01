import React, { useCallback, useMemo, useState } from 'react';
import { ConnectType, useWallet } from '@terra-money/wallet-provider';
import { useAccount } from 'contexts/account';
import { useBuyUstDialog } from 'pages/earn/components/useBuyUstDialog';
import { useSendDialog } from 'pages/send/useSendDialog';
import { useWalletDetailDialog } from './mobile/useWalletDetailDialog';
import { ViewAddressButton } from './mobile/ViewAddressButton';
import { MobileHeader } from './MobileHeader';
import { useAirdropElement } from './airdrop';
import { useVestingClaimNotification } from './vesting/VestingClaimNotification';

export function TerraMobileHeader() {
  const [open, setOpen] = useState<boolean>(false);
  const { status } = useAccount();
  const { connect, isChromeExtensionCompatibleBrowser } = useWallet();
  const [openWalletDetail, walletDetailElement] = useWalletDetailDialog();
  const [openSendDialog, sendDialogElement] = useSendDialog();
  const [openBuyUstDialog, buyUstDialogElement] = useBuyUstDialog();

  const toggleWallet = useCallback(() => {
    if (status === 'connected') {
      openWalletDetail({
        openSend: () => openSendDialog({}),
        openBuyUst: () => openBuyUstDialog({}),
      });
    } else if (status === 'disconnected') {
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

  const [vestingClaimNotificationElement] = useVestingClaimNotification();

  const viewAddress = useCallback(() => {
    setOpen(false);

    if (status === 'disconnected') {
      connect(ConnectType.READONLY);
    }
  }, [connect, status]);

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
        isActive={!!walletDetailElement}
        toggleWallet={toggleWallet}
        airdropElement={airdropElement}
        vestingClaimNotificationElement={vestingClaimNotificationElement}
        viewAddressButtonElement={viewAddressButtonElement}
      />
      {walletDetailElement}
      {sendDialogElement}
      {buyUstDialogElement}
    </>
  );
}
