import { Wallet } from '@anchor-protocol/icons';
import {
  demicrofy,
  formatUSTWithPostfixUnits,
  truncate,
} from '@anchor-protocol/notation';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { Bank } from 'contexts/bank';
import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import styled from 'styled-components';

interface ConnectedButtonProps
  extends Omit<
    DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    'children'
  > {
  walletAddress: string;
  bank: Bank;
}

function ConnectedButtonBase({
  walletAddress,
  bank,
  ...buttonProps
}: ConnectedButtonProps) {
  return (
    <button {...buttonProps}>
      <IconSpan>
        <span className="wallet-icon">
          <Wallet />
        </span>
        <span className="wallet-address">{truncate(walletAddress)}</span>
        <div className="wallet-balance">
          {formatUSTWithPostfixUnits(demicrofy(bank.userBalances.uUSD))} UST
        </div>
      </IconSpan>
    </button>
  );
}

const smallLayoutBreak = 1300;

export const ConnectedButton = styled(ConnectedButtonBase)`
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

  @media (max-width: ${smallLayoutBreak}px) {
    .wallet-balance {
      display: none;
    }
  }
`;
