import { HumanAddr } from '@anchor-protocol/types';
import { useWallet, WalletStatusType } from '@anchor-protocol/wallet-provider';
import { ClickAwayListener } from '@material-ui/core';
import { useIsDesktopChrome } from '@terra-dev/is-desktop-chrome';
import { useBank } from 'base/contexts/bank';
import { AirdropContent } from 'components/Header/WalletSelector/AirdropContent';
import { useProvideAddressDialog } from 'components/Header/WalletSelector/useProvideAddressDialog';
import { WalletConnectContent } from 'components/Header/WalletSelector/WalletConnectContent';
import { useAirdrop } from 'pages/airdrop/queries/useAirdrop';
import { useSendDialog } from 'pages/send/useSendDialog';
import { useCallback, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import { ConnectedButton } from './ConnectedButton';
import { DropdownContainer } from './DropdownContainer';
import { NotConnectedButton } from './NotConnectedButton';
import { WalletDetailContent } from './WalletDetailContent';

export interface WalletSelectorProps {
  className?: string;
}

function WalletSelectorBase({ className }: WalletSelectorProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const {
    status,
    install,
    connect,
    disconnect,
    connectWalletAddress,
  } = useWallet();

  const isDesktopChrome = useIsDesktopChrome();

  const bank = useBank();

  const [airdrop] = useAirdrop();

  const matchAirdrop = useRouteMatch('/airdrop');

  const [openSendDialog, sendDialogElement] = useSendDialog();

  const [openProvideAddress, provideAddressElement] = useProvideAddressDialog();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [open, setOpen] = useState(false);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const connectWallet = useCallback(() => {
    connect();
    setOpen(false);
  }, [connect]);

  const disconnectWallet = useCallback(() => {
    disconnect();
    window.location.reload();
  }, [disconnect]);

  const provideWallet = useCallback(
    (address?: HumanAddr) => {
      if (address) {
        connectWalletAddress(address);
      } else {
        openProvideAddress({});
      }
    },
    [openProvideAddress, connectWalletAddress],
  );

  const toggleOpen = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const onClickAway = useCallback(() => {
    setOpen(false);
  }, []);

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  switch (status.status) {
    case WalletStatusType.INITIALIZING:
      return (
        <div className={className}>
          <NotConnectedButton disabled>
            Initialzing Wallet...
          </NotConnectedButton>
        </div>
      );
    case WalletStatusType.NOT_CONNECTED:
    case WalletStatusType.NOT_INSTALLED:
    case WalletStatusType.UNAVAILABLE:
      if (isDesktopChrome) {
        if (status.status === WalletStatusType.NOT_CONNECTED) {
          return (
            <div className={className} onClick={connectWallet}>
              <NotConnectedButton>Connect Wallet</NotConnectedButton>
            </div>
          );
        } else if (status.status === WalletStatusType.NOT_INSTALLED) {
          return (
            <div className={className} onClick={install}>
              <NotConnectedButton>Please Install Wallet</NotConnectedButton>
            </div>
          );
        }
      }

      return (
        <ClickAwayListener onClickAway={onClickAway}>
          <div className={className}>
            <NotConnectedButton onClick={toggleOpen}>
              Connect Wallet
            </NotConnectedButton>

            {open && (
              <DropdownContainer>
                <WalletConnectContent
                  status={status}
                  closePopup={() => setOpen(false)}
                  installWallet={install}
                  provideWallet={provideWallet}
                  connectWallet={connectWallet}
                />
              </DropdownContainer>
            )}

            {provideAddressElement}
          </div>
        </ClickAwayListener>
      );
    case WalletStatusType.CONNECTED:
    case WalletStatusType.WALLET_ADDRESS_CONNECTED:
      return (
        <ClickAwayListener onClickAway={onClickAway}>
          <div className={className}>
            <ConnectedButton status={status} bank={bank} onClick={toggleOpen} />

            {status.status === WalletStatusType.CONNECTED &&
              airdrop &&
              airdrop !== 'in-progress' &&
              !open &&
              !matchAirdrop && (
                <DropdownContainer>
                  <AirdropContent />
                </DropdownContainer>
              )}

            {open && (
              <DropdownContainer>
                <WalletDetailContent
                  bank={bank}
                  status={status}
                  closePopup={() => setOpen(false)}
                  disconnectWallet={disconnectWallet}
                  openSend={() => openSendDialog({})}
                />
              </DropdownContainer>
            )}

            {sendDialogElement}
          </div>
        </ClickAwayListener>
      );
  }
}

export const WalletSelector = styled(WalletSelectorBase)`
  display: inline-block;
  position: relative;
  text-align: left;
`;
