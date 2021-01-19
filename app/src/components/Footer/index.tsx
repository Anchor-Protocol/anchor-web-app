import { IconButton } from '@material-ui/core';
import { WifiTethering } from '@material-ui/icons';
import { Discord } from '@anchor-protocol/icons';
import { screen } from 'env';
import { CSSProperties } from 'react';
import styled from 'styled-components';
import {
  Twitter,
  GitHub,
  Telegram,
  FiberManualRecord,
} from '@material-ui/icons';

export interface FooterProps {
  className?: string;
  style?: CSSProperties;
}

function FooterBase({ className, style }: FooterProps) {
  return (
    <footer className={className} style={style}>
      <div>
        <FiberManualRecord /> <s>Latest Block: 233333</s>
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
  color: rgba(255, 255, 255, 0.3);

  .MuiIconButton-root {
    color: rgba(255, 255, 255, 0.3);

    &:hover {
      color: rgba(255, 255, 255, 0.6);
    }
  }

  > :first-child {
    svg {
      font-size: 0.9em;
      transform: translateY(0.1em);
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
