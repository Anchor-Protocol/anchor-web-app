import {
  ConnectType,
  useWallet,
  WalletStatus,
} from '@anchor-protocol/wallet-provider2';
import { ClickAwayListener } from '@material-ui/core';
import { useBank } from 'base/contexts/bank';
import { useAirdrop } from 'pages/airdrop/queries/useAirdrop';
import { useSendDialog } from 'pages/send/useSendDialog';
import { useCallback, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import { AirdropContent } from './AirdropContent';
import { ConnectedButton } from './ConnectedButton';
import { DropdownContainer } from './DropdownContainer';
import { NotConnectedButton } from './NotConnectedButton';
import { WalletDetailContent } from './WalletDetailContent';

export interface WalletSelectorProps {
  className?: string;
}

let airdropClosed: boolean = false;

function WalletSelectorBase({ className }: WalletSelectorProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { status, connect, disconnect, walletAddress, network } = useWallet();

  const bank = useBank();

  const [airdrop] = useAirdrop();

  const matchAirdrop = useRouteMatch('/airdrop');

  const [openSendDialog, sendDialogElement] = useSendDialog();

  const [closed, setClosed] = useState(() => airdropClosed);

  const closeAirdrop = useCallback(() => {
    setClosed(true);
    airdropClosed = true;
  }, []);

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [open, setOpen] = useState(false);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const connectWallet = useCallback(() => {
    // TODO
    console.log('index.tsx..() connect wallet????');
    //connect(ConnectType.WALLETCONNECT);
    connect(ConnectType.EXTENSION);
    setOpen(false);
  }, [connect]);

  const disconnectWallet = useCallback(() => {
    disconnect();
    //window.location.reload();
  }, [disconnect]);

  //const provideWallet = useCallback(
  //  (address?: HumanAddr) => {
  //    if (address) {
  //      connectWalletAddress(address);
  //    } else {
  //      openProvideAddress({});
  //    }
  //  },
  //  [openProvideAddress, connectWalletAddress],
  //);

  const toggleOpen = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const onClickAway = useCallback(() => {
    setOpen(false);
  }, []);

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  switch (status) {
    case WalletStatus.INITIALIZING:
      return (
        <div className={className}>
          <NotConnectedButton disabled>
            Initialzing Wallet...
          </NotConnectedButton>
        </div>
      );
    case WalletStatus.WALLET_NOT_CONNECTED:
      return (
        <div className={className}>
          <NotConnectedButton onClick={connectWallet}>
            Connect Wallet
          </NotConnectedButton>
        </div>
      );
    case WalletStatus.WALLET_CONNECTED:
      return walletAddress ? (
        <ClickAwayListener onClickAway={onClickAway}>
          <div className={className}>
            <ConnectedButton
              walletAddress={walletAddress}
              bank={bank}
              onClick={toggleOpen}
            />

            {!closed &&
              airdrop &&
              airdrop !== 'in-progress' &&
              !open &&
              !matchAirdrop && (
                <DropdownContainer>
                  <AirdropContent onClose={closeAirdrop} />
                </DropdownContainer>
              )}

            {open && (
              <DropdownContainer>
                <WalletDetailContent
                  bank={bank}
                  walletAddress={walletAddress}
                  network={network}
                  closePopup={() => setOpen(false)}
                  disconnectWallet={disconnectWallet}
                  openSend={() => openSendDialog({})}
                />
              </DropdownContainer>
            )}

            {sendDialogElement}
          </div>
        </ClickAwayListener>
      ) : null;
  }
}

export const WalletSelector = styled(WalletSelectorBase)`
  display: inline-block;
  position: relative;
  text-align: left;
`;
