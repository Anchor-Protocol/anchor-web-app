import {
  BAssetInfoAndBalancesTotalWithDisplay,
  AnchorBank,
} from '@anchor-protocol/app-provider';
import {
  formatANC,
  formatAUSTWithPostfixUnits,
  formatBAsset,
  formatLP,
  formatLuna,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { demicrofy, truncate } from '@libs/formatter';
import { FlatButton } from '@libs/neumorphism-ui/components/FlatButton';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { Tooltip } from '@libs/neumorphism-ui/components/Tooltip';
import { Check, KeyboardArrowRight, Launch } from '@material-ui/icons';
import { NetworkInfo } from '@terra-money/use-wallet';
import { Connection } from '@terra-money/wallet-provider';
import big from 'big.js';
import { BuyButton, BuyLink } from 'components/BuyButton';
import React, { useCallback } from 'react';
import useClipboard from 'react-use-clipboard';
import styled from 'styled-components';
import { ConnectionIcons } from './ConnectionIcons';

interface WalletDetailContentProps {
  className?: string;
  network: NetworkInfo;
  walletAddress: string;
  closePopup: () => void;
  disconnectWallet: () => void;
  bank: AnchorBank;
  openSend: () => void;
  availablePost: boolean;
  connection: Connection;
  openBuyUst: () => void;
  bAssetBalanceTotal: BAssetInfoAndBalancesTotalWithDisplay | undefined;
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
  connection,
  bAssetBalanceTotal,
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
        <ConnectionIcons className="wallet-icon" connection={connection} />

        <h2 className="wallet-address">{truncate(walletAddress)}</h2>

        <button className="copy-wallet-address" onClick={setCopied}>
          <IconSpan>COPY ADDRESS {isCopied && <Check />}</IconSpan>
        </button>

        <ul>
          {big(bank.tokenBalances.uUST).gt(0) && (
            <li>
              <span>
                UST{' '}
                <BuyButton
                  onClick={() => {
                    openBuyUst();
                    closePopup();
                  }}
                >
                  BUY <Launch />
                </BuyButton>
              </span>
              <span>
                {formatUSTWithPostfixUnits(demicrofy(bank.tokenBalances.uUST))}
              </span>
            </li>
          )}
          {big(bank.tokenBalances.uaUST).gt(0) && (
            <li>
              <span>aUST</span>
              <span>
                {formatAUSTWithPostfixUnits(
                  demicrofy(bank.tokenBalances.uaUST),
                )}
              </span>
            </li>
          )}
          {big(bank.tokenBalances.uLuna).gt(0) && (
            <li>
              <span>LUNA</span>
              <span>{formatLuna(demicrofy(bank.tokenBalances.uLuna))}</span>
            </li>
          )}
          {big(bank.tokenBalances.ubLuna).gt(0) && (
            <li>
              <span>bLUNA</span>
              <span>{formatLuna(demicrofy(bank.tokenBalances.ubLuna))}</span>
            </li>
          )}
          {bAssetBalanceTotal?.infoAndBalances
            .filter(({ balance }) => big(balance.balance).gt(0))
            .map(({ bAsset, balance, tokenDisplay }) => (
              <li key={'basset-' + bAsset.symbol}>
                <span>
                  {tokenDisplay.symbol}{' '}
                  {tokenDisplay.symbol.toLowerCase() === 'beth' && (
                    <BuyLink
                      href="https://anchor.lido.fi/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      GET <Launch />
                    </BuyLink>
                  )}
                </span>
                <span>{formatBAsset(demicrofy(balance.balance))}</span>
              </li>
            ))}
          {/*{big(bank.tokenBalances.ubEth).gt(0) && (*/}
          {/*  <li>*/}
          {/*    <span>*/}
          {/*      bETH{' '}*/}
          {/*      <BuyLink*/}
          {/*        href="https://anchor.lido.fi/"*/}
          {/*        target="_blank"*/}
          {/*        rel="noreferrer"*/}
          {/*      >*/}
          {/*        GET <Launch />*/}
          {/*      </BuyLink>*/}
          {/*    </span>*/}
          {/*    <span>{formatBAsset(demicrofy(bank.tokenBalances.ubEth))}</span>*/}
          {/*  </li>*/}
          {/*)}*/}
          {big(bank.tokenBalances.uANC).gt(0) && (
            <li>
              <span>ANC</span>
              <span>{formatANC(demicrofy(bank.tokenBalances.uANC))}</span>
            </li>
          )}

          {process.env.NODE_ENV === 'development' && (
            <>
              <li>
                <span>ANC-UST LP</span>
                <span>{formatLP(demicrofy(bank.tokenBalances.uAncUstLP))}</span>
              </li>
              <li>
                <span>bLUNA-LUNA LP</span>
                <span>
                  {formatLP(demicrofy(bank.tokenBalances.ubLunaLunaLP))}
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
