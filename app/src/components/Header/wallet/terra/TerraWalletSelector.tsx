import React, { useCallback, useState } from 'react';
import { useAccount } from 'contexts/account';
import { ConnectionList } from './ConnectionList';
import { WalletSelector } from '../../desktop/WalletSelector';
import { Content } from './Content';
import { useSendDialog } from 'pages/send/useSendDialog';
import {
  DropdownContainer,
  DropdownBox,
} from 'components/Header/desktop/DropdownContainer';
import { useBuyUstDialog } from 'pages/earn/components/useBuyUstDialog';
import { useWallet } from '@terra-money/use-wallet';
import { useAirdropElement } from 'components/Header/airdrop';
import { useVestingClaimNotification } from 'components/Header/vesting/VestingClaimNotification';

const TerraWalletSelector = () => {
  const { terraWalletAddress, status } = useAccount();

  const { connect, disconnect, connection, availableConnectTypes } =
    useWallet();

  const [open, setOpen] = useState(false);

  const airdropElement = useAirdropElement(open, false);

  const [vestingClaimNotificationElement] = useVestingClaimNotification();

  const [openSendDialog, sendDialogElement] = useSendDialog();

  const [openBuyUstDialog, buyUstDialogElement] = useBuyUstDialog();

  const connectWallet = useCallback(() => {
    if (availableConnectTypes.length > 1) {
      setOpen(true);
    } else if (availableConnectTypes.length === 1) {
      connect(availableConnectTypes[0]);
    }
  }, [availableConnectTypes, connect]);

  const disconnectWallet = useCallback(() => {
    disconnect();
    setOpen(false);
  }, [disconnect]);

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <WalletSelector
      walletAddress={terraWalletAddress}
      initializing={status === 'initialization'}
      onClick={connectWallet}
      onClose={onClose}
    >
      <>
        {airdropElement && (
          <DropdownContainer>
            <DropdownBox>{airdropElement}</DropdownBox>
          </DropdownContainer>
        )}
        {vestingClaimNotificationElement}
        {open && (
          <DropdownContainer>
            <DropdownBox>
              {!terraWalletAddress || !connection ? (
                <ConnectionList setOpen={setOpen} />
              ) : (
                <Content
                  walletAddress={terraWalletAddress}
                  connection={connection}
                  onClose={onClose}
                  onDisconnectWallet={disconnectWallet}
                  onSend={() => {
                    openSendDialog({});
                    onClose();
                  }}
                  onBuyUST={() => {
                    openBuyUstDialog({});
                    onClose();
                  }}
                />
              )}
            </DropdownBox>
          </DropdownContainer>
        )}

        {sendDialogElement}
        {buyUstDialogElement}
      </>
    </WalletSelector>
  );
};

export { TerraWalletSelector };
