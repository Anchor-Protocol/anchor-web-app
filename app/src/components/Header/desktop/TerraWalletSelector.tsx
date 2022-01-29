import { useAirdropCheckQuery } from '@anchor-protocol/app-provider';
import { useAnchorBank } from '@anchor-protocol/app-provider/hooks/useAnchorBank';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { FlatButton } from '@libs/neumorphism-ui/components/FlatButton';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { Tooltip } from '@libs/neumorphism-ui/components/Tooltip';
import { ClickAwayListener } from '@material-ui/core';
import { ConnectType, useWallet } from '@terra-money/wallet-provider';
import { IconOnlyWalletButton } from 'components/Header/desktop/IconOnlyWalletButton';
import { useAccount } from 'contexts/account';
import { useBuyUstDialog } from 'pages/earn/components/useBuyUstDialog';
import { useSendDialog } from 'pages/send/useSendDialog';
import React, { useCallback, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Link, useRouteMatch } from 'react-router-dom';
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
  const { connected, status, terraWalletAddress } = useAccount();

  const {
    connect,
    disconnect,
    connection,
    network,
    availableConnectTypes,
    availableConnections,
    availableInstallations,
    supportFeatures,
  } = useWallet();

  const isSmallScreen = useMediaQuery({ query: '(max-width: 1000px)' });

  const bank = useAnchorBank();

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
    case 'initialization':
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
    case 'disconnected':
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
                    <h1>Connect Wallet</h1>

                    {availableConnections
                      .filter(({ type }) => type !== ConnectType.READONLY)
                      .map(({ type, icon, name, identifier }) => (
                        <FlatButton
                          key={'connection' + type + identifier}
                          className="connect"
                          onClick={() => {
                            connect(type, identifier);
                            setOpenDropdown(false);
                          }}
                        >
                          <IconSpan>
                            {name}
                            <img
                              src={
                                icon ===
                                'https://assets.terra.money/icon/station-extension/icon.png'
                                  ? 'https://assets.terra.money/icon/wallet-provider/station.svg'
                                  : icon
                              }
                              alt={name}
                            />
                          </IconSpan>
                        </FlatButton>
                      ))}

                    {availableInstallations
                      .filter(({ type }) => type === ConnectType.EXTENSION)
                      .map(({ type, identifier, name, icon, url }) => (
                        <BorderButton
                          key={'installation' + type + identifier}
                          className="install"
                          component="a"
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => {
                            setOpenDropdown(false);
                          }}
                        >
                          <IconSpan>
                            Install {name}
                            <img src={icon} alt={`Install ${name}`} />
                          </IconSpan>
                        </BorderButton>
                      ))}

                    <hr />

                    {availableConnectTypes.includes(ConnectType.READONLY) && (
                      <Tooltip
                        title="Read-only mode for viewing information. Please connect through Terra Station (extension or mobile) to make transactions."
                        placement="bottom"
                      >
                        <BorderButton
                          className="readonly"
                          onClick={() => {
                            connect(ConnectType.READONLY);
                            setOpenDropdown(false);
                          }}
                        >
                          View an address
                        </BorderButton>
                      </Tooltip>
                    )}

                    <TermsMessage>
                      By connecting, I accept Anchor's{' '}
                      <Link to="/terms">Terms of Service</Link>
                    </TermsMessage>
                  </ConnectTypeContent>
                </DropdownBox>
              </DropdownContainer>
            )}
          </div>
        </ClickAwayListener>
      );
    case 'connected':
      return connected ? (
        <ClickAwayListener onClickAway={onClickAway}>
          <div className={className}>
            {isSmallScreen ? (
              <IconOnlyWalletButton onClick={toggleOpen} connected />
            ) : (
              <ConnectedButton
                walletAddress={terraWalletAddress}
                totalUST={bank.tokenBalances.uUST}
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
                    connection={connection ?? availableConnections[0]}
                    bank={bank}
                    availablePost={supportFeatures.has('post')}
                    walletAddress={terraWalletAddress}
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

const TermsMessage = styled.p`
  margin-top: 1.5em;

  font-size: 11px;
  line-height: 1.5;

  color: ${({ theme }) => theme.dimTextColor};

  a {
    text-decoration: underline;
    color: ${({ theme }) => theme.colors.positive};
  }
`;

export const TerraWalletSelector = styled(WalletSelectorBase)`
  display: inline-block;
  position: relative;
  text-align: left;
`;

const ConnectTypeContent = styled.section`
  padding: 32px 28px;

  display: flex;
  flex-direction: column;

  h1 {
    font-size: 16px;
    font-weight: bold;

    text-align: center;
    margin-bottom: 16px;
  }

  button,
  a {
    width: 100%;
    height: 32px;

    font-size: 12px;
    font-weight: 500;

    > span {
      width: 100%;
      padding: 0 15px 1px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      img {
        transform: scale(1.1);
      }
    }

    &.connect,
    &.install {
      margin-bottom: 8px;
    }

    img {
      width: 1em;
      height: 1em;
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

  .connect {
    background-color: ${({ theme }) =>
      theme.palette.type === 'light' ? '#f4f4f5' : '#2a2a46'};

    color: ${({ theme }) => theme.textColor};
  }

  .install {
    border: 1px solid
      ${({ theme }) =>
        theme.palette.type === 'light' ? '#e7e7e7' : 'rgba(231,231,231, 0.3)'};
    color: ${({ theme }) => theme.textColor};
  }

  .readonly {
    border: 1px solid ${({ theme }) => theme.dimTextColor};
    color: ${({ theme }) => theme.dimTextColor};
  }
`;
