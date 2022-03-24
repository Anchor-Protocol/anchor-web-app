import { truncate } from '@libs/formatter';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { Check } from '@material-ui/icons';
import React from 'react';
import useClipboard from 'react-use-clipboard';
import styled from 'styled-components';
import { UIElementProps } from '@libs/ui';
import { ConnectionIcons } from './ConnectionIcons';

interface WalletContentProps extends UIElementProps {
  walletAddress: string;
  connectionName: string;
  connectionIcon: string;
  readonly: boolean;
  onDisconnectWallet: () => void;
}

export function WalletContentBase(props: WalletContentProps) {
  const {
    className,
    children,
    walletAddress,
    connectionName,
    connectionIcon,
    readonly,
    onDisconnectWallet,
  } = props;

  const [isCopied, setCopied] = useClipboard(walletAddress, {
    successDuration: 1000 * 5,
  });

  return (
    <div className={className}>
      <section className="header">
        <ConnectionIcons
          className="wallet-icon"
          name={connectionName}
          icon={connectionIcon}
          readonly={readonly}
        />
        <h2 className="wallet-address">{truncate(walletAddress)}</h2>
        <button className="copy-wallet-address" onClick={setCopied}>
          <IconSpan>COPY ADDRESS {isCopied && <Check />}</IconSpan>
        </button>
      </section>
      <section className="children">{children}</section>
      <button className="disconnect" onClick={onDisconnectWallet}>
        Disconnect
      </button>
    </div>
  );
}

export const WalletContent = styled(WalletContentBase)`
  > .header {
    padding: 32px 28px 0px 28px;

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
  }

  > .children {
    display: flex;
    flex-direction: column;
    padding: 0 28px 32px 28px;
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
