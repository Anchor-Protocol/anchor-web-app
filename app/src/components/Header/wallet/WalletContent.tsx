// import { AnchorBank } from '@anchor-protocol/app-provider/hooks/useAnchorBank';
// import {
//   formatANC,
//   formatAUSTWithPostfixUnits,
//   formatBAsset,
//   formatLP,
//   formatLuna,
//   formatUSTWithPostfixUnits,
// } from '@anchor-protocol/notation';
import {
  // demicrofy,
  truncate,
} from '@libs/formatter';
// import { FlatButton } from '@libs/neumorphism-ui/components/FlatButton';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
// import { Tooltip } from '@libs/neumorphism-ui/components/Tooltip';
import {
  Check,
  // KeyboardArrowRight,
  // Launch
} from '@material-ui/icons';
// import { NetworkInfo } from '@terra-money/use-wallet';
// import { Connection as TerraConnection } from '@terra-money/wallet-provider';
// import { Connection } from '@libs/evm-wallet';
// import big from 'big.js';
// import { BuyButton, BuyLink } from 'components/BuyButton';
import React from 'react';
import useClipboard from 'react-use-clipboard';
import styled from 'styled-components';
//import { ConnectionIcons } from './ConnectionIcons';
import { UIElementProps } from '@libs/ui';

interface WalletContentProps extends UIElementProps {
  //chainId: number;
  //connection: Connection;
  walletAddress: string;
  onDisconnectWallet: () => void;
  // availablePost: boolean;
  // bank: AnchorBank;
  // closePopup: () => void;
  // openBuyUst: () => void;
  // openSend: () => void;
}

export function WalletContentBase({
  className,
  //chainId,
  //connection,
  walletAddress,
  onDisconnectWallet,
}: // availablePost,
// bank,
// closePopup,
// openBuyUst,
// openSend,
WalletContentProps) {
  const [isCopied, setCopied] = useClipboard(walletAddress, {
    successDuration: 1000 * 5,
  });

  return (
    <div className={className}>
      <section>
        {/* <ConnectionIcons
          className="wallet-icon"
          connection={connection as unknown as TerraConnection}
        /> */}
        <h2 className="wallet-address">{truncate(walletAddress)}</h2>
        <button className="copy-wallet-address" onClick={setCopied}>
          <IconSpan>COPY ADDRESS {isCopied && <Check />}</IconSpan>
        </button>
      </section>

      <div>content</div>

      <button className="disconnect" onClick={onDisconnectWallet}>
        Disconnect
      </button>
    </div>
  );
}

export const WalletContent = styled(WalletContentBase)`
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
