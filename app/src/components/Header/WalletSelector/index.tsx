import {
  ConnectType,
  useWallet,
  WalletStatus,
} from '@anchor-protocol/wallet-provider';
import { ClickAwayListener } from '@material-ui/core';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
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

let _airdropClosed: boolean = false;

function WalletSelectorBase({ className }: WalletSelectorProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const {
    status,
    connect,
    disconnect,
    walletAddress,
    network,
    availableExtension,
  } = useWallet();

  const bank = useBank();

  const [airdrop] = useAirdrop();

  const matchAirdrop = useRouteMatch('/airdrop');

  const [openSendDialog, sendDialogElement] = useSendDialog();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [openDetail, setOpenDetail] = useState<boolean>(false);

  const [airdropClosed, setAirdropClosed] = useState(() => _airdropClosed);

  const closeAirdrop = useCallback(() => {
    setAirdropClosed(true);
    _airdropClosed = true;
  }, []);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const connectWallet = useCallback(() => {
    if (availableExtension) {
      setOpenDetail(true);
    } else {
      connect(ConnectType.WALLETCONNECT);
    }
  }, [availableExtension, connect]);

  const disconnectWallet = useCallback(() => {
    disconnect();
    setOpenDetail(false);
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
    setOpenDetail((prev) => !prev);
  }, []);

  const onClickAway = useCallback(() => {
    setOpenDetail(false);
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
        <ClickAwayListener onClickAway={onClickAway}>
          <div className={className}>
            <NotConnectedButton onClick={connectWallet}>
              Connect Wallet
            </NotConnectedButton>

            {openDetail && (
              <DropdownContainer>
                <ConnectTypeContent>
                  <ActionButton
                    onClick={() => {
                      connect(ConnectType.WALLETCONNECT);
                      setOpenDetail(false);
                    }}
                  >
                    Wallet Connect
                  </ActionButton>

                  <ActionButton
                    onClick={() => {
                      connect(ConnectType.EXTENSION);
                      setOpenDetail(false);
                    }}
                  >
                    Extension
                  </ActionButton>
                </ConnectTypeContent>
              </DropdownContainer>
            )}
          </div>
        </ClickAwayListener>
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

            {!airdropClosed &&
              airdrop &&
              airdrop !== 'in-progress' &&
              !openDetail &&
              !matchAirdrop && (
                <DropdownContainer>
                  <AirdropContent onClose={closeAirdrop} />
                </DropdownContainer>
              )}

            {openDetail && (
              <DropdownContainer>
                <WalletDetailContent
                  bank={bank}
                  walletAddress={walletAddress}
                  network={network}
                  closePopup={() => setOpenDetail(false)}
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

const ConnectTypeContent = styled.section`
  padding: 32px 28px;

  button {
    width: 100%;
    height: 22px;
  }
`;
