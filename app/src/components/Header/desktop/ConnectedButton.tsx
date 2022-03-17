import { Wallet } from '@anchor-protocol/icons';
import { truncate } from '@libs/formatter';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import styled from 'styled-components';
import { u, UST } from '@anchor-protocol/types';
import { useFormatters } from '@anchor-protocol/formatter/useFormatters';

interface ConnectedButtonProps
  extends Omit<
    DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    'children'
  > {
  walletAddress: string;
  totalUST: u<UST>;
}

function ConnectedButtonBase({
  walletAddress,
  totalUST,
  ...buttonProps
}: ConnectedButtonProps) {
  const {
    ust: { formatOutput, demicrofy, symbol },
  } = useFormatters();
  return (
    <button {...buttonProps}>
      <IconSpan>
        <span className="wallet-icon">
          <Wallet />
        </span>
        <span className="wallet-address">{truncate(walletAddress)}</span>
        <div className="wallet-balance">
          {`${formatOutput(demicrofy(totalUST))} ${symbol}`}
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

  color: ${({ theme }) => theme.header.textColor};
  border: 1px solid ${({ theme }) => theme.header.textColor};
  outline: none;
  background-color: transparent;

  .wallet-address {
    margin-left: 6px;
    color: ${({ theme }) => theme.header.textColor};
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
      border-left: 1px solid ${({ theme }) => theme.header.textColor};
    }
  }

  &:hover {
    border: 1px solid ${({ theme }) => theme.header.textColor};
    background-color: rgba(255, 255, 255, 0.04);
  }

  @media (max-width: ${smallLayoutBreak}px) {
    .wallet-balance {
      display: none;
    }
  }
`;
