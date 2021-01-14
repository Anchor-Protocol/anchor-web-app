import { useWallet } from '@anchor-protocol/wallet-provider';
import {
  formatUSTWithPostfixUnits,
  MICRO,
  truncate,
} from '@anchor-protocol/notation';
import big from 'big.js';
import { Wallet } from 'components/icons/Wallet';
import { useBank } from 'contexts/bank';
import styled from 'styled-components';

export interface WalletSelectorProps {
  className?: string;
}

function WalletSelectorBase({ className }: WalletSelectorProps) {
  const { status, install, connect, disconnect } = useWallet();
  const bank = useBank();

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
          Connect Wallet
        </button>
      );
    case 'ready':
      return (
        <button className={className} onClick={disconnect}>
          <Wallet /> {truncate(status.walletAddress)}
          {bank.status === 'connected' && (
            <div>
              {formatUSTWithPostfixUnits(
                big(bank.userBalances.uUSD).div(MICRO),
              )}{' '}
              UST
            </div>
          )}
        </button>
      );
    default:
      return (
        <button className={className} onClick={install}>
          Please Install Wallet
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

  svg {
    font-size: 1em;
    transform: translateY(0.15em);
    margin-right: 0.1em;
  }

  div {
    position: relative;
    display: inline-block;
    height: 100%;
    margin-left: 1em;
    padding-left: 1em;

    &::before {
      content: '';
      position: absolute;
      top: -9px;
      bottom: -8px;
      left: 0;
      border-left: 1px solid rgba(255, 255, 255, 0.1);
    }
  }

  &:hover {
    border: 1px solid rgba(255, 255, 255, 0.2);
    background-color: rgba(255, 255, 255, 0.04);

    div {
      &::before {
        border-left: 1px solid rgba(255, 255, 255, 0.2);
      }
    }
  }
`;
