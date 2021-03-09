import { useWallet } from '@anchor-protocol/wallet-provider';
import { useService } from '@anchor-protocol/web-contexts/contexts/service';
import { getParser } from 'bowser';
import { useMemo } from 'react';
import styled from 'styled-components';

export interface BannerProps {
  className?: string;
}

function BannerBase({ className }: BannerProps) {
  const { status, install, connect } = useWallet();
  const { online } = useService();

  const isChrome = useMemo(() => {
    const browser = getParser(navigator.userAgent);
    return browser.satisfies({
      chrome: '>60',
      edge: '>80',
    });
  }, []);

  if (!isChrome) {
    return (
      <div className={className}>
        <p>
          Anchor currently only supports{' '}
          <a href="https://www.google.com/chrome/">Chrome</a>
        </p>
      </div>
    );
  }

  if (!online) {
    return (
      <div className={className}>
        <p>Network is offline. the data cannot be loaded.</p>
      </div>
    );
  }

  switch (status.status) {
    case 'not_installed':
      return (
        <div className={className}>
          <p>Wallet is not installed.</p>
          <button onClick={install}>Please install Wallet</button>
        </div>
      );
    case 'not_connected':
      return (
        <div className={className}>
          <p>Wallet is not connected.</p>
          <button onClick={connect}>Please connect Wallet</button>
        </div>
      );
    default:
      return null;
  }
}

export const Banner = styled(BannerBase)`
  height: 70px;
  background-color: #cfb673;
  display: flex;
  justify-content: center;
  align-items: center;

  color: ${({ theme }) => theme.textColor};
  font-size: 1em;

  button {
    font-size: 0.9em;
    background-color: transparent;
    outline: none;
    cursor: pointer;
    border: 1px solid currentColor;

    margin-left: 10px;

    color: ${({ theme }) => theme.textColor};

    padding: 5px 15px;
    border-radius: 20px;
  }
`;
