import { Wallet } from '@anchor-protocol/icons';
import {
  demicrofy,
  formatANC,
  formatAUSTWithPostfixUnits,
  formatLP,
  formatLuna,
  formatUSTWithPostfixUnits,
  truncate,
} from '@anchor-protocol/notation';
import { useWallet, WalletStatusType } from '@anchor-protocol/wallet-provider';
import { ClickAwayListener } from '@material-ui/core';
import { Check, KeyboardArrowRight } from '@material-ui/icons';
import { BorderButton } from '@terra-dev/neumorphism-ui/components/BorderButton';
import { FlatButton } from '@terra-dev/neumorphism-ui/components/FlatButton';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { useBank } from 'base/contexts/bank';
import { useAirdrop } from 'pages/airdrop/queries/useAirdrop';
import { useSendDialog } from 'pages/send/useSendDialog';
import { useCallback, useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import useClipboard from 'react-use-clipboard';
import styled, { keyframes } from 'styled-components';
import airdropImage from './assets/airdrop.svg';

export interface WalletSelectorProps {
  className?: string;
}

function WalletSelectorBase({ className }: WalletSelectorProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { status, install, connect, disconnect } = useWallet();

  const bank = useBank();

  const [openSendDialog, sendDialogElement] = useSendDialog();

  const [airdrop] = useAirdrop();

  const matchAirdrop = useRouteMatch('/airdrop');

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [open, setOpen] = useState(false);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const [isCopied, setCopied] = useClipboard(
    status.status === WalletStatusType.CONNECTED ? status.walletAddress : '',
    { successDuration: 1000 * 5 },
  );

  const connectWallet = useCallback(() => {
    connect();
    setOpen(false);
  }, [connect]);

  const disconnectWallet = useCallback(() => {
    disconnect();
    window.location.reload();
  }, [disconnect]);

  const toggleOpen = useCallback(() => {
    if (status.status === WalletStatusType.CONNECTED) {
      setOpen((prev) => !prev);
    }
  }, [status.status]);

  const onClickAway = useCallback(() => {
    setOpen(false);
  }, []);

  const viewOnTerraFinder = useCallback(() => {
    if (status.status === WalletStatusType.CONNECTED) {
      window.open(
        `https://finder.terra.money/${status.network.chainID}/account/${status.walletAddress}`,
        '_blank',
      );
    }
  }, [status]);

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  switch (status.status) {
    case WalletStatusType.INITIALIZING:
      return (
        <div className={className}>
          <WalletConnectButton disabled>
            <IconSpan>
              <span className="wallet-icon">
                <Wallet />
              </span>
              Initialzing Wallet...
            </IconSpan>
          </WalletConnectButton>
        </div>
      );
    case WalletStatusType.NOT_CONNECTED:
      return (
        <div className={className}>
          <WalletConnectButton onClick={connectWallet}>
            <IconSpan>
              <span className="wallet-icon">
                <Wallet />
              </span>
              Connect Wallet
            </IconSpan>
          </WalletConnectButton>
        </div>
      );
    case WalletStatusType.CONNECTED:
      return (
        <ClickAwayListener onClickAway={onClickAway}>
          <div className={className}>
            <WalletButton onClick={toggleOpen}>
              <IconSpan>
                <span className="wallet-icon">
                  <Wallet />
                </span>
                <span className="wallet-address">
                  {truncate(status.walletAddress)}
                </span>
                <div className="wallet-balance">
                  {formatUSTWithPostfixUnits(demicrofy(bank.userBalances.uUSD))}{' '}
                  UST
                </div>
              </IconSpan>
            </WalletButton>
            {airdrop && airdrop !== 'in-progress' && !open && !matchAirdrop && (
              <WalletDropdown>
                <AirdropContent>
                  <img src={airdropImage} alt="Airdrop!" />
                  <h2>Airdrop</h2>
                  <p>Claim your ANC tokens</p>
                  <FlatButton component={Link} to="/airdrop">
                    Claim
                  </FlatButton>
                </AirdropContent>
              </WalletDropdown>
            )}
            {open && (
              <WalletDropdown>
                <section>
                  <div className="wallet-icon">
                    <Wallet />
                  </div>

                  <h2 className="wallet-address">
                    {truncate(status.walletAddress)}
                  </h2>

                  <button className="copy-wallet-address" onClick={setCopied}>
                    <IconSpan>COPY ADDRESS {isCopied && <Check />}</IconSpan>
                  </button>

                  <ul>
                    <li>
                      <span>UST</span>
                      <span>
                        {formatUSTWithPostfixUnits(
                          demicrofy(bank.userBalances.uUSD),
                        )}
                      </span>
                    </li>
                    <li>
                      <span>aUST</span>
                      <span>
                        {formatAUSTWithPostfixUnits(
                          demicrofy(bank.userBalances.uaUST),
                        )}
                      </span>
                    </li>
                    <li>
                      <span>Luna</span>
                      <span>
                        {formatLuna(demicrofy(bank.userBalances.uLuna))}
                      </span>
                    </li>
                    <li>
                      <span>bLuna</span>
                      <span>
                        {formatLuna(demicrofy(bank.userBalances.ubLuna))}
                      </span>
                    </li>
                    <li>
                      <span>ANC</span>
                      <span>
                        {formatANC(demicrofy(bank.userBalances.uANC))}
                      </span>
                    </li>
                    {process.env.NODE_ENV === 'development' && (
                      <>
                        <li>
                          <span>ANC-UST LP</span>
                          <span>
                            {formatLP(demicrofy(bank.userBalances.uAncUstLP))}
                          </span>
                        </li>
                        <li>
                          <span>bLuna-Luna LP</span>
                          <span>
                            {formatLP(
                              demicrofy(bank.userBalances.ubLunaLunaLP),
                            )}
                          </span>
                        </li>
                      </>
                    )}
                  </ul>

                  <div className="send">
                    <FlatButton
                      onClick={() => {
                        openSendDialog({});
                        setOpen(false);
                      }}
                    >
                      SEND
                    </FlatButton>
                  </div>

                  <div className="outlink">
                    <button onClick={viewOnTerraFinder}>
                      View on Terra Finder{' '}
                      <i>
                        <KeyboardArrowRight />
                      </i>
                    </button>

                    {process.env.NODE_ENV === 'development' && (
                      <a
                        href="https://faucet.terra.money/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Go to Faucet{' '}
                        <i>
                          <KeyboardArrowRight />
                        </i>
                      </a>
                    )}
                  </div>
                </section>

                <button className="disconnect" onClick={disconnectWallet}>
                  Disconnect
                </button>
              </WalletDropdown>
            )}
            {sendDialogElement}
          </div>
        </ClickAwayListener>
      );
    case 'not_installed':
      return (
        <WalletConnectButton className={className} onClick={install}>
          <IconSpan>
            <span className="wallet-icon">
              <Wallet />
            </span>
            Please Install Wallet
          </IconSpan>
        </WalletConnectButton>
      );
    default:
      return null;
  }
}

export const WalletConnectButton = styled(BorderButton)`
  height: 26px;
  border-radius: 20px;
  padding: 4px 20px;
  font-size: 12px;
  font-weight: 700;

  .wallet-icon {
    svg {
      transform: scale(1.2) translateY(0.15em);
    }

    margin-right: 17px;

    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 1px;
      bottom: 1px;
      right: -11px;
      border-left: 1px solid rgba(255, 255, 255, 0.2);
    }
  }

  color: ${({ theme }) => theme.colors.positive};
  border-color: ${({ theme }) => theme.colors.positive};

  &:hover {
    color: ${({ theme }) => theme.colors.positive};
    border-color: ${({ theme }) => theme.colors.positive};
  }
`;

export const WalletButton = styled.button`
  height: 26px;
  border-radius: 20px;
  padding: 4px 17px;
  font-size: 12px;

  cursor: pointer;

  .wallet-icon {
    svg {
      transform: scale(1.2) translateY(0.15em);
    }
  }

  color: ${({ theme }) => theme.colors.positive};
  border: 1px solid ${({ theme }) => theme.colors.positive};
  outline: none;
  background-color: transparent;

  .wallet-address {
    margin-left: 6px;
    color: #8a8a8a;
  }

  .wallet-balance {
    font-weight: 700;

    position: relative;
    display: inline-block;
    height: 100%;
    margin-left: 1em;
    padding-left: 1em;

    &::before {
      content: '';
      position: absolute;
      top: 1px;
      bottom: 1px;
      left: 0;
      border-left: 1px solid rgba(255, 255, 255, 0.2);
    }
  }

  &:hover {
    border: 1px solid ${({ theme }) => theme.colors.positive};
    background-color: rgba(255, 255, 255, 0.04);
  }
`;

const parachute = keyframes`
  0% {
    transform: rotate(10deg) translateY(0);
  }
  
  25% {
    transform: rotate(-10deg) translateY(-3px);
  }
  
  50% {
    transform: rotate(10deg) translateY(0);
  }
  
  75% {
    transform: rotate(-10deg) translateY(3px);
  }
  
  100% {
    transform: rotate(10deg) translateY(0);
  }
`;

const AirdropContent = styled.div`
  margin: 30px;
  text-align: center;

  img {
    animation: ${parachute} 6s ease-in-out infinite;
  }

  h2 {
    margin-top: 13px;

    font-size: 16px;
    font-weight: 500;
  }

  p {
    margin-top: 5px;

    font-size: 13px;
    font-weight: 500;
    color: ${({ theme }) => theme.dimTextColor};
  }

  a {
    margin-top: 15px;

    width: 100%;
    height: 28px;

    background-color: ${({ theme }) => theme.colors.positive};
  }
`;

export const WalletDropdown = styled.div`
  position: absolute;
  display: block;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;

  min-width: 260px;

  border: 1px solid ${({ theme }) => theme.highlightBackgroundColor};
  background-color: ${({ theme }) => theme.highlightBackgroundColor};
  box-shadow: 0 0 21px 4px rgba(0, 0, 0, 0.3);
  border-radius: 15px;

  button {
    cursor: pointer;
  }

  > section {
    padding: 32px 28px;

    .wallet-icon {
      width: 38px;
      height: 38px;
      background-color: #000000;
      border-radius: 50%;
      color: #ffffff;

      display: grid;
      place-content: center;

      svg {
        font-size: 16px;
      }
    }

    .wallet-address {
      margin-top: 15px;

      color: ${({ theme }) => theme.textColor};
      font-size: 18px;
      font-weight: 500;
    }

    .copy-wallet-address {
      margin-top: 8px;

      border: 0;
      outline: none;
      border-radius: 12px;
      font-size: 9px;
      padding: 5px 10px;

      background-color: ${({ theme }) =>
        theme.palette.type === 'light' ? '#f1f1f1' : 'rgba(0, 0, 0, 0.15)'};
      color: ${({ theme }) => theme.dimTextColor};

      &:hover {
        background-color: ${({ theme }) =>
          theme.palette.type === 'light' ? '#e1e1e1' : 'rgba(0, 0, 0, 0.2)'};
        color: ${({ theme }) => theme.textColor};
      }
    }

    ul {
      margin-top: 48px;

      padding: 0;
      list-style: none;

      font-size: 12px;
      color: ${({ theme }) =>
        theme.palette.type === 'light'
          ? '#666666'
          : 'rgba(255, 255, 255, 0.6)'};

      border-top: 1px solid
        ${({ theme }) =>
          theme.palette.type === 'light'
            ? '#e5e5e5'
            : 'rgba(255, 255, 255, 0.1)'};

      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 35px;

        &:not(:last-child) {
          border-bottom: 1px dashed
            ${({ theme }) =>
              theme.palette.type === 'light'
                ? '#e5e5e5'
                : 'rgba(255, 255, 255, 0.1)'};
        }
      }

      margin-bottom: 20px;
    }

    .send {
      margin-bottom: 20px;

      button {
        width: 100%;
        height: 28px;

        background-color: ${({ theme }) => theme.colors.positive};
      }
    }

    .outlink {
      text-align: center;

      button,
      a {
        border: 0;
        outline: none;
        background-color: transparent;
        font-size: 12px;
        color: ${({ theme }) => theme.dimTextColor};
        display: inline-flex;
        align-items: center;

        i {
          margin-left: 5px;
          transform: translateY(1px);

          width: 16px;
          height: 16px;
          border-radius: 50%;

          svg {
            font-size: 11px;
            transform: translateY(1px);
          }

          background-color: ${({ theme }) =>
            theme.palette.type === 'light' ? '#f1f1f1' : 'rgba(0, 0, 0, 0.15)'};
          color: ${({ theme }) =>
            theme.palette.type === 'light'
              ? '#666666'
              : 'rgba(255, 255, 255, 0.6)'};

          &:hover {
            background-color: ${({ theme }) =>
              theme.palette.type === 'light'
                ? '#e1e1e1'
                : 'rgba(0, 0, 0, 0.2)'};
            color: ${({ theme }) =>
              theme.palette.type === 'light'
                ? '#666666'
                : 'rgba(255, 255, 255, 0.6)'};
          }
        }
      }
    }
  }

  .disconnect {
    border: none;
    outline: none;

    background-color: ${({ theme }) =>
      theme.palette.type === 'light' ? '#f1f1f1' : 'rgba(0, 0, 0, 0.15)'};
    color: ${({ theme }) => theme.dimTextColor};

    &:hover {
      background-color: ${({ theme }) =>
        theme.palette.type === 'light' ? '#e1e1e1' : 'rgba(0, 0, 0, 0.2)'};
      color: ${({ theme }) => theme.textColor};
    }

    font-size: 12px;
    width: 100%;
    height: 36px;

    border-bottom-left-radius: 14px;
    border-bottom-right-radius: 14px;
  }
`;

export const WalletSelector = styled(WalletSelectorBase)`
  display: inline-block;
  position: relative;
  text-align: left;
`;
