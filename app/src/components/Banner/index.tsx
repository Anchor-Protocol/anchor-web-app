import { useWallet } from '@anchor-protocol/wallet-provider';
import styled from 'styled-components';
import { matchesUA } from 'browserslist-useragent';

export interface BannerProps {
  className?: string;
}

const isChrome = matchesUA(navigator.userAgent, { browsers: ['Chrome > 60'] });

function BannerBase({ className }: BannerProps) {
  const { status, install, connect } = useWallet();

  if (!isChrome) {
    return (
      <div className={className}>
        <p>
          Anchor currently only supports{' '}
          <a href="https://www.google.com/chrome/?brand=CHBD&brand=BNSD&gclid=Cj0KCQiA6Or_BRC_ARIsAPzuer_951Qv_ycnWlDRowxEnDcORIo1XgAmLIH_qAl1HlugMzmhMsLvo8saAnDSEALw_wcB&gclsrc=aw.ds">
            Chrome
          </a>
        </p>
      </div>
    );
  }

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
  height: 70px;
  background-color: #cfb673;
  display: grid;
  place-content: center;
`;
