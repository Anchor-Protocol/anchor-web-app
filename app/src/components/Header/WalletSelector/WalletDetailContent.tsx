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
import { Check, KeyboardArrowRight } from '@material-ui/icons';
import { FlatButton } from '@terra-dev/neumorphism-ui/components/FlatButton';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { NetworkInfo } from '@terra-dev/wallet-types';
import { Bank } from 'base/contexts/bank';
import { useCallback } from 'react';
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
}

export function WalletDetailContentBase({
  className,
  walletAddress,
  network,
  disconnectWallet,
  closePopup,
  bank,
  openSend,
  availablePost,
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
        <div className="wallet-icon">
          <Wallet />
        </div>

        <h2 className="wallet-address">{truncate(walletAddress)}</h2>

        <button className="copy-wallet-address" onClick={setCopied}>
          <IconSpan>COPY ADDRESS {isCopied && <Check />}</IconSpan>
        </button>

        <ul>
          <li>
            <span>UST</span>
            <span>
              {formatUSTWithPostfixUnits(demicrofy(bank.userBalances.uUSD))}
            </span>
          </li>
          <li>
            <span>aUST</span>
            <span>
              {formatAUSTWithPostfixUnits(demicrofy(bank.userBalances.uaUST))}
            </span>
          </li>
          <li>
            <span>Luna</span>
            <span>{formatLuna(demicrofy(bank.userBalances.uLuna))}</span>
          </li>
          <li>
            <span>bLuna</span>
            <span>{formatLuna(demicrofy(bank.userBalances.ubLuna))}</span>
          </li>
          <li>
            <span>ANC</span>
            <span>{formatANC(demicrofy(bank.userBalances.uANC))}</span>
          </li>
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
