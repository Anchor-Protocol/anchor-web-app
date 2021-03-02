import { Wallet } from '@anchor-protocol/icons';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import {
  demicrofy,
  formatANC,
  formatLP,
  formatLuna,
  formatUSTWithPostfixUnits,
  truncate,
} from '@anchor-protocol/notation';
import { useWallet } from '@anchor-protocol/wallet-provider';
import { ClickAwayListener } from '@material-ui/core';
import { Check, KeyboardArrowRight } from '@material-ui/icons';
import { useBank } from 'contexts/bank';
import { useService } from 'contexts/service';
import { useSendDialog } from 'pages/send/useSendDialog';
import { useCallback, useState } from 'react';
import useClipboard from 'react-use-clipboard';
import styled from 'styled-components';

export interface WalletSelectorProps {
  className?: string;
}

function WalletSelectorBase({ className }: WalletSelectorProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { status, install, connect, disconnect } = useWallet();

  const bank = useBank();

  const { serviceAvailable } = useService();

  const [openSendDialog, sendDialogElement] = useSendDialog();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [open, setOpen] = useState(false);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const [isCopied, setCopied] = useClipboard(
    status.status === 'ready' ? status.walletAddress : '',
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
    if (status.status === 'ready') {
      setOpen((prev) => !prev);
    }
  }, [status.status]);

  const onClickAway = useCallback(() => {
    setOpen(false);
  }, []);

  const viewOnTerraFinder = useCallback(() => {
    if (status.status === 'ready') {
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
    case 'initializing':
      return (
        <div className={className}>
          <WalletConnectButton disabled>
            Initialzing Wallet...
          </WalletConnectButton>
        </div>
      );
    case 'not_connected':
      return (
        <div className={className}>
          <WalletConnectButton onClick={connectWallet}>
            Connect Wallet
          </WalletConnectButton>
        </div>
      );
    case 'ready':
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
                {serviceAvailable && (
                  <div>
                    {formatUSTWithPostfixUnits(
                      demicrofy(bank.userBalances.uUSD),
                    )}{' '}
                    UST
                  </div>
                )}
              </IconSpan>
            </WalletButton>
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
                        {formatUSTWithPostfixUnits(
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
                    <li>
                      <span>ANC-UST-LP</span>
                      <span>
                        {formatLP(demicrofy(bank.userBalances.uAncUstLP))}
                      </span>
                    </li>
                    <li>
                      <span>bLuna-Luna-LP</span>
                      <span>
                        {formatLP(demicrofy(bank.userBalances.ubLunaLunaLP))}
                      </span>
                    </li>
                  </ul>

                  <div className="send">
                    <ActionButton
                      onClick={() => {
                        openSendDialog({});
                        setOpen(false);
                      }}
                    >
                      SEND
                    </ActionButton>
                  </div>

                  <div className="outlink">
                    <button onClick={viewOnTerraFinder}>
                      View on Terra Finder{' '}
                      <i>
                        <KeyboardArrowRight />
                      </i>
                    </button>

                    {process.env.NODE_ENV === 'development' && (
                      <button
                        className="outlink"
                        // @ts-ignore
                        component="a"
                        href="https://faucet.terra.money/"
                        target="_blank"
                      >
                        Go to Faucet{' '}
                        <i>
                          <KeyboardArrowRight />
                        </i>
                      </button>
                    )}
                  </div>
                </section>

                <button className="disconnect" onClick={disconnectWallet}>
                  DISCONNECT
                </button>
              </WalletDropdown>
            )}
            {sendDialogElement}
          </div>
        </ClickAwayListener>
      );
    case 'not_installed':
      return (
        <WalletConnectButton className={className}>
          <button className={className} onClick={install}>
            Please Install Wallet
          </button>
        </WalletConnectButton>
      );
    default:
      return null;
  }
}

export const WalletConnectButton = styled(ActionButton)`
  border-radius: 20px;
  padding: 8px 20px;

  font-size: 12px;

  height: 34px;
`;

export const WalletButton = styled.button`
  height: 34px;

  font-size: 12px;

  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 8px 20px;
  outline: none;
  background-color: transparent;

  color: #ffffff;

  .wallet-icon {
    svg {
      transform: scale(1.2) translateY(0.15em);
    }
  }

  .wallet-address {
    margin-left: 6px;
    color: #8a8a8a;
  }

  cursor: pointer;

  div {
    font-weight: 500;

    position: relative;
    display: inline-block;
    height: 100%;
    margin-left: 1em;
    padding-left: 1em;

    &::before {
      content: '';
      position: absolute;
      top: -2px;
      bottom: -2px;
      left: 0;
      border-left: 1px solid rgba(255, 255, 255, 0.2);
    }
  }

  &:hover {
    border: 1px solid rgba(255, 255, 255, 0.3);
    background-color: rgba(255, 255, 255, 0.04);

    div {
      &::before {
        border-left: 1px solid rgba(255, 255, 255, 0.3);
      }
    }
  }
`;

export const WalletDropdown = styled.div`
  position: absolute;
  display: block;
  top: 40px;
  right: 0;
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
      }
    }

    .outlink {
      text-align: center;

      button {
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
