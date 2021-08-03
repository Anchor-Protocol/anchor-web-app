import {
  demicrofy,
  formatANC,
  formatAUSTWithPostfixUnits,
  formatLP,
  formatLuna,
  formatUSTWithPostfixUnits,
  truncate,
} from '@anchor-protocol/notation';
import { Check, KeyboardArrowRight, Launch } from '@material-ui/icons';
import { buttonBaseStyle } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { FlatButton } from '@terra-dev/neumorphism-ui/components/FlatButton';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { Tooltip } from '@terra-dev/neumorphism-ui/components/Tooltip';
import { NetworkInfo } from '@terra-dev/wallet-types';
import { ConnectType } from '@terra-money/wallet-provider';
import { Bank } from 'base/contexts/bank';
import big from 'big.js';
import { ConnectionIcons } from 'components/Header/WalletSelector/ConnectionIcons';
import React, { useCallback } from 'react';
import useClipboard from 'react-use-clipboard';
import styled from 'styled-components';

interface WalletDetailContentProps {
  className?: string;
  network: NetworkInfo;
  walletAddress: string;
  closePopup: () => void;
  disconnectWallet: () => void;
  bank: Bank;
  openSend: () => void;
  availablePost: boolean;
  connectType: ConnectType;
  openBuyUst: () => void;
}

export function WalletDetailContentBase({
  className,
  walletAddress,
  network,
  disconnectWallet,
  closePopup,
  bank,
  openSend,
  openBuyUst,
  availablePost,
  connectType,
}: WalletDetailContentProps) {
  const [isCopied, setCopied] = useClipboard(walletAddress, {
    successDuration: 1000 * 5,
  });

  const viewOnTerraFinder = useCallback(() => {
    window.open(
      `https://finder.terra.money/${network.chainID}/account/${walletAddress}`,
      '_blank',
    );
  }, [network.chainID, walletAddress]);

  return (
    <div className={className}>
      <section>
        <ConnectionIcons className="wallet-icon" connectType={connectType} />

        <h2 className="wallet-address">{truncate(walletAddress)}</h2>

        <button className="copy-wallet-address" onClick={setCopied}>
          <IconSpan>COPY ADDRESS {isCopied && <Check />}</IconSpan>
        </button>

        <ul>
          {big(bank.userBalances.uUSD).gt(0) && (
            <li>
              <span>
                UST{' '}
                <BuyUstButton
                  onClick={() => {
                    openBuyUst();
                    closePopup();
                  }}
                >
                  BUY <Launch />
                </BuyUstButton>
              </span>
              <span>
                {formatUSTWithPostfixUnits(demicrofy(bank.userBalances.uUSD))}
              </span>
            </li>
          )}
          {big(bank.userBalances.uaUST).gt(0) && (
            <li>
              <span>aUST</span>
              <span>
                {formatAUSTWithPostfixUnits(demicrofy(bank.userBalances.uaUST))}
              </span>
            </li>
          )}
          {big(bank.userBalances.uLuna).gt(0) && (
            <li>
              <span>Luna</span>
              <span>{formatLuna(demicrofy(bank.userBalances.uLuna))}</span>
            </li>
          )}
          {big(bank.userBalances.ubLuna).gt(0) && (
            <li>
              <span>bLuna</span>
              <span>{formatLuna(demicrofy(bank.userBalances.ubLuna))}</span>
            </li>
          )}
          {big(bank.userBalances.uANC).gt(0) && (
            <li>
              <span>ANC</span>
              <span>{formatANC(demicrofy(bank.userBalances.uANC))}</span>
            </li>
          )}

          {process.env.NODE_ENV === 'development' && (
            <>
              <li>
                <span>ANC-UST LP</span>
                <span>{formatLP(demicrofy(bank.userBalances.uAncUstLP))}</span>
              </li>
              <li>
                <span>bLuna-Luna LP</span>
                <span>
                  {formatLP(demicrofy(bank.userBalances.ubLunaLunaLP))}
                </span>
              </li>
            </>
          )}
        </ul>

        {availablePost && (
          <>
            <div className="bridge">
              <div>
                <Tooltip
                  title="Transfer Terra assets from Ethereum"
                  placement="top"
                >
                  <FlatButton
                    component="a"
                    href="https://bridge.terra.money/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src="/assets/bridge.png" alt="Terra Bridge" />
                  </FlatButton>
                </Tooltip>
                <FlatButton
                  component="a"
                  href="https://docs.anchorprotocol.com/user-guide/interchain-transfers"
                  target="_blank"
                  rel="noreferrer"
                >
                  Docs <Launch />
                </FlatButton>
              </div>
            </div>

            <div className="send">
              <FlatButton
                onClick={() => {
                  openSend();
                  closePopup();
                }}
              >
                SEND
              </FlatButton>
            </div>
          </>
        )}

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
    </div>
  );
}

const BuyUstButton = styled.button`
  ${buttonBaseStyle};

  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.hoverBackgroundColor};

  height: 16px;
  border-radius: 6px;
  padding: 0 8px 1px 8px;

  font-size: 9px;
  color: ${({ theme }) => theme.colors.positive};

  transform: translateY(-1.5px);

  svg {
    font-size: 1em;
    margin-left: 1px;
    transform: translateY(1px);
  }

  &:hover {
    color: ${({ theme }) => theme.colors.positive};
    border-color: ${({ theme }) => theme.colors.positive};
  }
`;

export const WalletDetailContent = styled(WalletDetailContentBase)`
  > section {
    padding: 32px 28px;

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

    .bridge {
      margin-bottom: 10px;

      > div {
        display: flex;

        > :first-child {
          flex: 1;
          height: 28px;
          background-color: ${({ theme }) => theme.colors.positive};

          img {
            height: 24px;
            transform: translateX(5px);
          }

          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }

        > :last-child {
          font-size: 12px;

          width: 60px;
          height: 28px;
          margin-left: 1px;
          background-color: ${({ theme }) => theme.colors.positive};

          svg {
            margin-left: 3px;
            font-size: 1em;
            transform: scale(1.1);
          }

          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
      }
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
