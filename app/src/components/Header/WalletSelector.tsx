import { useWallet } from '@anchor-protocol/wallet-provider';
import { truncate } from 'libs/text';
import styled from 'styled-components';

export interface WalletSelectorProps {
  className?: string;
}

function WalletSelectorBase({ className }: WalletSelectorProps) {
  const { status, install, connect, disconnect } = useWallet();

  switch (status.status) {
    case 'initializing':
      return (
        <button className={className} disabled>
          Initialzing Wallet...
        </button>
      );
    case 'not_connected':
      return (
        <button className={className} onClick={connect}>
          Connect wallet
        </button>
      );
    case 'ready':
      return (
        <button className={className} onClick={disconnect}>
          {truncate(status.walletAddress)}
        </button>
      );
    default:
      return (
        <button className={className} onClick={install}>
          Please install Wallet...
        </button>
      );
  }
}

export const WalletSelector = styled(WalletSelectorBase)`
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 8px 20px;
  outline: none;
  background-color: transparent;

  color: #ffffff;

  cursor: pointer;

  &:hover {
    border: 1px solid rgba(255, 255, 255, 0.3);
    background-color: rgba(255, 255, 255, 0.04);
  }
`;
