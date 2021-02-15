import { Discord } from '@anchor-protocol/icons';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { useWallet } from '@anchor-protocol/wallet-provider';
import { IconButton } from '@material-ui/core';
import {
  FiberManualRecord,
  GitHub,
  Telegram,
  Twitter,
} from '@material-ui/icons';
import c from 'color';
import { screen } from 'env';
import { useLastSyncedHeight } from 'queries/lastSyncedHeight';
import { CSSProperties } from 'react';
import styled from 'styled-components';

export interface FooterProps {
  className?: string;
  style?: CSSProperties;
}

function FooterBase({ className, style }: FooterProps) {
  const { status } = useWallet();
  const { data: lastSyncedHeight } = useLastSyncedHeight();

  return (
    <footer className={className} style={style}>
      <div>
        <a
          href={`https://finder.terra.money/${status.network.chainID}/blocks/${lastSyncedHeight}`}
          target="_blank"
          rel="noreferrer"
        >
          <IconSpan>
            <FiberManualRecord />{' '}
            {status.network.name.toLowerCase().indexOf('mainnet') !== 0 && (
              <b>({status.network.name.toUpperCase()}) </b>
            )}
            Latest Block: {lastSyncedHeight}
          </IconSpan>
        </a>
      </div>
      <div>
        <IconButton>
          <Discord />
        </IconButton>
        <IconButton>
          <Twitter />
        </IconButton>
        <IconButton>
          <Telegram />
        </IconButton>
        <IconButton>
          <GitHub />
        </IconButton>
      </div>
    </footer>
  );
}

export const Footer = styled(FooterBase)`
  font-size: 12px;
  color: ${({ theme }) => c(theme.dimTextColor).alpha(0.5).toString()};

  a {
    text-decoration: none;
  }

  a,
  .MuiIconButton-root {
    color: ${({ theme }) => c(theme.dimTextColor).alpha(0.5).toString()};

    &:hover {
      color: ${({ theme }) => theme.dimTextColor};
    }
  }

  > :last-child {
    > :not(:first-child) {
      margin-left: 0.7em;
    }
  }

  // ---------------------------------------------
  // layout
  // ---------------------------------------------
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: ${screen.mobile.max}px) {
    flex-direction: column;
  }
`;
