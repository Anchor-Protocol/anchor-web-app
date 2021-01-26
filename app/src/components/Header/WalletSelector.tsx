import { Wallet } from '@anchor-protocol/icons';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { HorizontalRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalRuler';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import {
  demicrofy,
  formatLuna,
  formatUSTWithPostfixUnits,
  truncate,
} from '@anchor-protocol/notation';
import { useWallet } from '@anchor-protocol/wallet-provider';
import { ClickAwayListener } from '@material-ui/core';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
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

  const connectWallet = useCallback(() => {
    connect();
    setOpen(false);
  }, [connect]);

  const toggleOpen = useCallback(() => {
    if (status.status === 'ready') {
      setOpen((prev) => !prev);
    }
  }, [status.status]);

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
          <WalletConnectButton disabled>
            Initialzing Wallet...
          </WalletConnectButton>
        </div>
      );
    case 'not_connected':
      return (
        <div className={className}>
          <WalletConnectButton onClick={connectWallet}>
            Connect Wallet
          </WalletConnectButton>
        </div>
      );
    case 'ready':
      return (
        <ClickAwayListener onClickAway={onClickAway}>
          <div className={className}>
            <WalletButton onClick={toggleOpen}>
              <IconSpan>
                <Wallet /> {truncate(status.walletAddress)}
                {bank.status === 'connected' && (
                  <div>
                    {formatUSTWithPostfixUnits(
                      demicrofy(bank.userBalances.uUSD),
                    )}{' '}
                    UST
                  </div>
                )}
              </IconSpan>
            </WalletButton>
            {open && (
              <WalletDropdown>
                <h2>
                  <IconSpan>
                    <Wallet /> {truncate(status.walletAddress)}
                  </IconSpan>
                </h2>
                <ActionButton onClick={disconnect}>Disconnect</ActionButton>
                <ActionButton onClick={setCopied}>
                  Copy Address {isCopied && `(Copied!)`}
                </ActionButton>
                <ActionButton onClick={viewOnTerraFinder}>
                  View on Terra Finder
                </ActionButton>

                <HorizontalRuler style={{ margin: '2em 0' }} />

                <h2>Balances</h2>
                <TxFeeList>
                  <TxFeeListItem label="UST">
                    {formatUSTWithPostfixUnits(
                      demicrofy(bank.userBalances.uUSD),
                    )}
                  </TxFeeListItem>
                  <TxFeeListItem label="aUST">
                    {formatUSTWithPostfixUnits(
                      demicrofy(bank.userBalances.uaUST),
                    )}
                  </TxFeeListItem>
                  <TxFeeListItem label="Luna">
                    {formatLuna(demicrofy(bank.userBalances.uLuna))}
                  </TxFeeListItem>
                  <TxFeeListItem label="bLuna">
                    {formatLuna(demicrofy(bank.userBalances.ubLuna))}
                  </TxFeeListItem>
                </TxFeeList>
              </WalletDropdown>
            )}
          </div>
        </ClickAwayListener>
      );
    case 'not_installed':
      return (
        <WalletConnectButton className={className}>
          <button className={className} onClick={install}>
            Please Install Wallet
          </button>
        </WalletConnectButton>
      );
    default:
      return null;
  }
}

export const WalletConnectButton = styled(ActionButton)`
  border-radius: 20px;
  padding: 8px 20px;

  height: 34px;
`;

export const WalletButton = styled.button`
  height: 34px;

  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 8px 20px;
  outline: none;
  background-color: transparent;

  color: #ffffff;

  cursor: pointer;

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

export const WalletDropdown = styled.div`
  position: absolute;
  display: block;
  top: 40px;
  right: 0;
  padding: 30px;
  z-index: 1000;
  background-color: ${({ theme }) => theme.backgroundColor};
  box-shadow: 0px 0px 21px 4px rgba(0, 0, 0, 0.3);
  border-radius: 1em;

  > * {
    margin-bottom: 10px;
  }

  h2 {
    font-size: 1.2em;
    font-weight: 500;
  }

  button {
    width: 100%;
  }
`;

export const WalletSelector = styled(WalletSelectorBase)`
  display: inline-block;
  position: relative;
  text-align: left;
`;
