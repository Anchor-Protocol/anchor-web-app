import { useWallet } from 'hooks/use-wallet';
import { truncate } from 'libs/text';
import { useCallback } from 'react';
import styled from 'styled-components';

export interface WalletSelectorProps {
  className?: string;
}

function WalletSelectorBase({ className }: WalletSelectorProps) {
  const { address, connect, disconnect } = useWallet();

  const connectWallet = useCallback(() => {
    if (address) {
      disconnect();
    } else {
      connect();
    }
  }, [address, connect, disconnect]);

  return (
    <button className={className} onClick={connectWallet}>
      {address ? truncate(address) : 'connect wallet'}
    </button>
  );
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
