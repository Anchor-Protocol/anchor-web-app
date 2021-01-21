import { Discord } from '@anchor-protocol/icons';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { IconButton } from '@material-ui/core';
import {
  FiberManualRecord,
  GitHub,
  Telegram,
  Twitter,
} from '@material-ui/icons';
import { screen } from 'env';
import { CSSProperties } from 'react';
import styled from 'styled-components';

export interface FooterProps {
  className?: string;
  style?: CSSProperties;
}

function FooterBase({ className, style }: FooterProps) {
  return (
    <footer className={className} style={style}>
      <div>
        <IconSpan>
          <FiberManualRecord /> <s>Latest Block: 233333</s>
        </IconSpan>
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
