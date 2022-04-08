import React, { useCallback, useMemo, useState } from 'react';
import { ConnectType, useWallet } from '@terra-money/wallet-provider';
import { useAccount } from 'contexts/account';
import { useBuyUstDialog } from 'pages/earn/components/useBuyUstDialog';
import { useSendDialog } from 'pages/send/useSendDialog';
import { useWalletDialog } from './useWalletDialog';
import { useAirdropElement } from 'components/Header/airdrop';
import { useVestingClaimNotification } from 'components/Header/vesting/VestingClaimNotification';
import { ViewAddressButton } from '../ViewAddressButton';
import { MobileHeader } from '../MobileHeader';

export function TerraMobileHeader() {
  const [open, setOpen] = useState<boolean>(false);
  const { status } = useAccount();
  const { connect, isChromeExtensionCompatibleBrowser } = useWallet();
  const [openWalletDialog, walletDialogElement] = useWalletDialog();
  const [openSendDialog, sendDialogElement] = useSendDialog();
  const [openBuyUstDialog, buyUstDialogElement] = useBuyUstDialog();

  const toggleWallet = useCallback(() => {
    if (status === 'connected') {
      openWalletDialog({
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
    openWalletDialog,
    status,
  ]);

  const airdropElement = useAirdropElement(open, true);

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
        isActive={!!walletDialogElement}
        toggleWallet={toggleWallet}
        airdropElement={airdropElement}
        vestingClaimNotificationElement={vestingClaimNotificationElement}
        viewAddressButtonElement={viewAddressButtonElement}
      />
      {walletDialogElement}
      {sendDialogElement}
      {buyUstDialogElement}
    </>
  );
}
