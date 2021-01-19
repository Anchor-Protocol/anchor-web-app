import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { TextButton } from '@anchor-protocol/neumorphism-ui/components/TextButton';
import {
  formatLuna,
  formatUSTWithPostfixUnits,
  MICRO,
  truncate,
} from '@anchor-protocol/notation';
import { useWallet } from '@anchor-protocol/wallet-provider';
import { ClickAwayListener } from '@material-ui/core';
import big from 'big.js';
import { Wallet } from '@anchor-protocol/icons';
import { useBank } from 'contexts/bank';
import { useCallback, useState } from 'react';
import useClipboard from 'react-use-clipboard';
import styled from 'styled-components';

export interface WalletSelectorProps {
  className?: string;
}

function WalletSelectorBase({ className }: WalletSelectorProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { status, install, connect, disconnect } = useWallet();

  const bank = useBank();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [open, setOpen] = useState(false);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const [isCopied, setCopied] = useClipboard(
    status.status === 'ready' ? status.walletAddress : '',
    { successDuration: 1000 * 5 },
  );

  const toggleOpen = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const onClickAway = useCallback(() => {
    setOpen(false);
  }, []);

  const viewOnTerraFinder = useCallback(() => {
    if (status.status === 'ready') {
      window.open(
        `https://finder.terra.money/${status.network.chainID}/account/${status.walletAddress}`,
        '_blank',
      );
    }
  }, [status]);

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  switch (status.status) {
    case 'initializing':
      return (
        <div className={className}>
          <button disabled>Initialzing Wallet...</button>
        </div>
      );
    case 'not_connected':
      return (
        <div className={className}>
          <button onClick={connect}>Connect Wallet</button>
        </div>
      );
    case 'ready':
      return (
        <ClickAwayListener onClickAway={onClickAway}>
          <div className={className}>
            <button onClick={toggleOpen}>
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
            {open && (
              <div>
                <h2>
                  <Wallet /> {truncate(status.walletAddress)}
                </h2>
                <ActionButton onClick={disconnect}>Disconnect</ActionButton>
                <TextButton onClick={setCopied}>
                  Copy Address {isCopied && `(Copied!)`}
                </TextButton>
                <TextButton onClick={viewOnTerraFinder}>
                  View on Terra Finder
                </TextButton>
                <h2>Balances</h2>
                <ul>
                  <li>
                    UST:{' '}
                    {formatUSTWithPostfixUnits(
                      big(bank.userBalances.uUSD).div(MICRO),
                    )}
                  </li>
                  <li>
                    aUST:{' '}
                    {formatUSTWithPostfixUnits(
                      big(bank.userBalances.uaUST).div(MICRO),
                    )}
                  </li>
                  <li>
                    Luna: {formatLuna(big(bank.userBalances.uLuna).div(MICRO))}
                  </li>
                  <li>
                    bLuna:{' '}
                    {formatLuna(big(bank.userBalances.ubLuna).div(MICRO))}
                  </li>
                </ul>
              </div>
            )}
          </div>
        </ClickAwayListener>
      );
    default:
      return (
        <div className={className}>
          <button className={className} onClick={install}>
            Please Install Wallet
          </button>
        </div>
      );
  }
}

export const WalletSelector = styled(WalletSelectorBase)`
  display: inline-block;

  position: relative;

  text-align: left;

  > button {
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
  }

  > div {
    position: absolute;
    display: block;
    top: 40px;
    right: 0;
    padding: 20px;
    z-index: 1000;
    border: 1px solid white;
    background-color: ${({ theme }) => theme.backgroundColor};

    > * {
      margin-bottom: 10px;
    }

    button {
      width: 100%;
    }
  }
`;
