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
import { DropdownBox, DropdownContainer } from './DropdownContainer';
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
    wallets,
    network,
    availableConnectTypes,
  } = useWallet();

  const bank = useBank();

  const [airdrop] = useAirdrop();

  const matchAirdrop = useRouteMatch('/airdrop');

  const [openSendDialog, sendDialogElement] = useSendDialog();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);

  const [airdropClosed, setAirdropClosed] = useState(() => _airdropClosed);

  const closeAirdrop = useCallback(() => {
    setAirdropClosed(true);
    _airdropClosed = true;
  }, []);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const connectWallet = useCallback(() => {
    if (availableConnectTypes.length > 1) {
      setOpenDropdown(true);
    } else if (availableConnectTypes.length === 1) {
      connect(availableConnectTypes[0]);
    }
  }, [availableConnectTypes, connect]);

  const disconnectWallet = useCallback(() => {
    disconnect();
    setOpenDropdown(false);
    //window.location.reload();
  }, [disconnect]);

  const toggleOpen = useCallback(() => {
    setOpenDropdown((prev) => !prev);
  }, []);

  const onClickAway = useCallback(() => {
    setOpenDropdown(false);
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

            {openDropdown && (
              <DropdownContainer>
                <DropdownBox>
                  <ConnectTypeContent>
                    {availableConnectTypes.map((connectType) => (
                      <ActionButton
                        key={connectType}
                        onClick={() => {
                          connect(connectType);
                          setOpenDropdown(false);
                        }}
                      >
                        {connectType}
                      </ActionButton>
                    ))}
                  </ConnectTypeContent>
                </DropdownBox>
              </DropdownContainer>
            )}
          </div>
        </ClickAwayListener>
      );
    case WalletStatus.WALLET_CONNECTED:
      return wallets.length > 0 ? (
        <ClickAwayListener onClickAway={onClickAway}>
          <div className={className}>
            <ConnectedButton
              walletAddress={wallets[0].terraAddress}
              bank={bank}
              onClick={toggleOpen}
            />

            {!airdropClosed &&
              airdrop &&
              airdrop !== 'in-progress' &&
              !openDropdown &&
              !matchAirdrop && (
                <DropdownContainer>
                  <DropdownBox>
                    <AirdropContent onClose={closeAirdrop} />
                  </DropdownBox>
                </DropdownContainer>
              )}

            {openDropdown && (
              <DropdownContainer>
                <DropdownBox>
                  <WalletDetailContent
                    bank={bank}
                    availablePost={
                      wallets[0].connectType === ConnectType.CHROME_EXTENSION ||
                      wallets[0].connectType === ConnectType.WALLETCONNECT
                    }
                    walletAddress={wallets[0].terraAddress}
                    network={network}
                    closePopup={() => setOpenDropdown(false)}
                    disconnectWallet={disconnectWallet}
                    openSend={() => openSendDialog({})}
                  />
                </DropdownBox>
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
