import { Discord } from '@anchor-protocol/icons';
import {
  useLastSyncedHeightQuery,
  useNetwork,
} from '@anchor-protocol/app-provider';
import { IconButton } from '@material-ui/core';
import {
  Brightness3,
  Brightness5,
  FiberManualRecord,
  GitHub,
  Telegram,
  Twitter,
} from '@material-ui/icons';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { useTheme } from 'contexts/theme';
import { screen } from 'env';
import c from 'color';
import React, { CSSProperties } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export interface FooterProps {
  className?: string;
  style?: CSSProperties;
}

function FooterBase({ className, style }: FooterProps) {
  const { network } = useNetwork();
  const { data: lastSyncedHeight = 0 } = useLastSyncedHeightQuery();

  const { themeColor, switchable, updateTheme } = useTheme();

  return (
    <footer className={className} style={style}>
      <div>
        <a
          href={`https://finder.terra.money/${network.chainID}/blocks/${lastSyncedHeight}`}
          target="_blank"
          rel="noreferrer"
        >
          <IconSpan>
            <FiberManualRecord className="point" />{' '}
            {network.name.toLowerCase().indexOf('mainnet') !== 0 && (
              <b>[{network.name.toUpperCase()}] </b>
            )}
            Latest Block: {lastSyncedHeight}
          </IconSpan>
        </a>

        <Link to="/terms" style={{ marginLeft: 28 }}>
          Terms
        </Link>
      </div>
      <div>
        <IconButton
          component="a"
          href="https://discord.gg/9aUYgpKZ9c"
          target="_blank"
          rel="noreferrer"
        >
          <Discord />
        </IconButton>
        <IconButton
          component="a"
          href="https://twitter.com/anchor_protocol"
          target="_blank"
          rel="noreferrer"
        >
          <Twitter />
        </IconButton>
        <IconButton
          component="a"
          href="https://t.me/anchor_official"
          target="_blank"
          rel="noreferrer"
        >
          <Telegram />
        </IconButton>
        <IconButton
          component="a"
          href="https://github.com/Anchor-Protocol"
          target="_blank"
          rel="noreferrer"
        >
          <GitHub />
        </IconButton>
        {switchable && (
          <IconButton
            onClick={() =>
              updateTheme(themeColor === 'light' ? 'dark' : 'light')
            }
          >
            {themeColor === 'light' ? <Brightness5 /> : <Brightness3 />}
          </IconButton>
        )}
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

  .point {
    color: ${({ theme }) => theme.colors.positive};
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

  @media (max-width: ${screen.tablet.max}px) {
    flex-direction: column;
  }
`;
