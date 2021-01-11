import { useWallet } from '@anchor-protocol/wallet-provider';
import styled from 'styled-components';

export interface BannerProps {
  className?: string;
}

function BannerBase({ className }: BannerProps) {
  const { status, install, connect } = useWallet();

  switch (status.status) {
    case 'not_installed':
      return (
        <div className={className}>
          <p>Demo Mode: Not installed</p>
          <button onClick={install}>Install Wallet</button>
        </div>
      );
    case 'not_connected':
      return (
        <div className={className}>
          <p>Demo Mode: Not Connected</p>
          <button onClick={connect}>Connect Wallet</button>
        </div>
      );
    default:
      return null;
  }
}

export const Banner = styled(BannerBase)`
  height: 100px;
  background-color: #cfb673;
  display: grid;
  place-content: center;
`;
