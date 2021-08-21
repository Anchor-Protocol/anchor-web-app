import { Terra, Walletconnect } from '@anchor-protocol/icons';
import { useAirdropCheckQuery } from '@anchor-protocol/webapp-provider';
import { ClickAwayListener } from '@material-ui/core';
import { BorderButton } from '@packages/neumorphism-ui/components/BorderButton';
import { FlatButton } from '@packages/neumorphism-ui/components/FlatButton';
import { IconSpan } from '@packages/neumorphism-ui/components/IconSpan';
import { Tooltip } from '@packages/neumorphism-ui/components/Tooltip';
import {
  ConnectType,
  useWallet,
  WalletStatus,
} from '@terra-money/wallet-provider';
import { IconOnlyWalletButton } from 'components/Header/desktop/IconOnlyWalletButton';
import { useBank } from 'contexts/bank';
import { useBuyUstDialog } from 'pages/earn/components/useBuyUstDialog';
import { useSendDialog } from 'pages/send/useSendDialog';
import React, { useCallback, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import { AirdropContent } from '../airdrop/AirdropContent';
import { WalletDetailContent } from '../wallet/WalletDetailContent';
import { ConnectedButton } from './ConnectedButton';
import { DropdownBox, DropdownContainer } from './DropdownContainer';
import { NotConnectedButton } from './NotConnectedButton';

export interface WalletSelectorProps {
  className?: string;
}

let _airdropClosed: boolean = false;

function WalletSelectorBase({ className }: WalletSelectorProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const {
    install,
    status,
    connect,
    disconnect,
    wallets,
    network,
    availableConnectTypes,
    availableInstallTypes,
  } = useWallet();

  const isSmallScreen = useMediaQuery({ query: '(max-width: 1000px)' });

  const bank = useBank();

  const { data: airdrop, isLoading: airdropIsLoading } = useAirdropCheckQuery();
  //const airdrop = useMemo<Airdrop | 'in-progress' | null>(
  //  () => ({
  //    createdAt: '',
  //    id: 1,
  //    stage: 1,
  //    address: '',
  //    staked: '100000000' as uANC,
  //    total: '100000000' as uANC,
  //    rate: '0.1' as Rate,
  //    amount: '100000000' as uANC,
  //    proof: '',
  //    merkleRoot: '',
  //    claimable: true,
  //  }),
  //  [],
  //);

  const matchAirdrop = useRouteMatch('/airdrop');

  const [openSendDialog, sendDialogElement] = useSendDialog();

  const [openBuyUstDialog, buyUstDialogElement] = useBuyUstDialog();

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
          {isSmallScreen ? (
            <IconOnlyWalletButton disabled />
          ) : (
            <NotConnectedButton disabled>
              Initializing Wallet...
            </NotConnectedButton>
          )}
        </div>
      );
    case WalletStatus.WALLET_NOT_CONNECTED:
      return (
        <ClickAwayListener onClickAway={onClickAway}>
          <div className={className}>
            {isSmallScreen ? (
              <IconOnlyWalletButton onClick={connectWallet} />
            ) : (
              <NotConnectedButton onClick={connectWallet}>
                Connect Wallet
              </NotConnectedButton>
            )}

            {openDropdown && (
              <DropdownContainer>
                <DropdownBox>
                  <ConnectTypeContent>
                    {availableConnectTypes.some(
                      (connectType) => connectType === ConnectType.WEBEXTENSION,
                    ) ? (
                      <FlatButton
                        className="connect-chrome-extension"
                        onClick={() => {
                          connect(ConnectType.WEBEXTENSION);
                          setOpenDropdown(false);
                        }}
                      >
                        <IconSpan>
                          <Terra />
                          Terra Station (extension)
                        </IconSpan>
                      </FlatButton>
                    ) : availableConnectTypes.some(
                        (connectType) =>
                          connectType === ConnectType.CHROME_EXTENSION,
                      ) ? (
                      <FlatButton
                        className="connect-chrome-extension"
                        onClick={() => {
                          connect(ConnectType.CHROME_EXTENSION);
                          setOpenDropdown(false);
                        }}
                      >
                        <IconSpan>
                          <Terra />
                          Terra Station (extension)
                        </IconSpan>
                      </FlatButton>
                    ) : availableInstallTypes.some(
                        (connectType) =>
                          connectType === ConnectType.CHROME_EXTENSION,
                      ) ? (
                      <BorderButton
                        className="install-chrome-extension"
                        onClick={() => {
                          install(ConnectType.CHROME_EXTENSION);
                          setOpenDropdown(false);
                        }}
                      >
                        <IconSpan>
                          <Terra />
                          Install Chrome Extension
                        </IconSpan>
                      </BorderButton>
                    ) : null}

                    {availableConnectTypes.some(
                      (connectType) =>
                        connectType === ConnectType.WALLETCONNECT,
                    ) && (
                      <FlatButton
                        className="connect-walletconnect"
                        onClick={() => {
                          connect(ConnectType.WALLETCONNECT);
                          setOpenDropdown(false);
                        }}
                      >
                        <IconSpan>
                          <Walletconnect />
                          Terra Station (mobile)
                        </IconSpan>
                      </FlatButton>
                    )}

                    <hr />

                    {availableConnectTypes.some(
                      (connectType) => connectType === ConnectType.READONLY,
                    ) && (
                      <Tooltip
                        title="Read-only mode for viewing information. Please connect through Terra Station (extension or mobile) to make transactions."
                        placement="bottom"
                      >
                        <BorderButton
                          className="connect-readonly"
                          onClick={() => {
                            connect(ConnectType.READONLY);
                            setOpenDropdown(false);
                          }}
                        >
                          View an address
                        </BorderButton>
                      </Tooltip>
                    )}
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
            {isSmallScreen ? (
              <IconOnlyWalletButton onClick={toggleOpen} connected />
            ) : (
              <ConnectedButton
                walletAddress={wallets[0].terraAddress}
                bank={bank}
                onClick={toggleOpen}
              />
            )}

            {!airdropClosed &&
              airdrop &&
              !airdropIsLoading &&
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
                    connectType={wallets[0].connectType}
                    bank={bank}
                    availablePost={
                      wallets[0].connectType === ConnectType.WEBEXTENSION ||
                      wallets[0].connectType === ConnectType.CHROME_EXTENSION ||
                      wallets[0].connectType === ConnectType.WALLETCONNECT
                    }
                    walletAddress={wallets[0].terraAddress}
                    network={network}
                    closePopup={() => setOpenDropdown(false)}
                    disconnectWallet={disconnectWallet}
                    openSend={() => openSendDialog({})}
                    openBuyUst={() => openBuyUstDialog({})}
                  />
                </DropdownBox>
              </DropdownContainer>
            )}

            {sendDialogElement}
            {buyUstDialogElement}
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

  display: flex;
  flex-direction: column;

  button {
    width: 100%;
    height: 32px;

    font-size: 12px;
    font-weight: 700;

    &.connect-chrome-extension,
    &.install-chrome-extension {
      margin-bottom: 8px;
    }

    svg,
    .MuiSvgIcon-root {
      //transform: scale(1.2) translateY(0.13em);
      margin-right: 0.4em;
    }
  }

  hr {
    margin: 12px 0;

    border: 0;
    border-bottom: 1px dashed
      ${({ theme }) =>
        theme.palette.type === 'light'
          ? '#e5e5e5'
          : 'rgba(255, 255, 255, 0.1)'};
  }

  .connect-chrome-extension,
  .connect-walletconnect {
    background-color: ${({ theme }) => theme.colors.positive};
  }

  .install-chrome-extension {
    border: 1px solid ${({ theme }) => theme.colors.positive};
    color: ${({ theme }) => theme.colors.positive};
  }

  .connect-readonly {
    border: 1px solid ${({ theme }) => theme.dimTextColor};
    color: ${({ theme }) => theme.dimTextColor};
  }
`;
