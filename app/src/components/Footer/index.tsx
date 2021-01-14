import { IconButton } from '@material-ui/core';
import { Discord } from 'components/icons/Discord';
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
        <FiberManualRecord /> Latest Block: 233333
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
  display: flex;
  justify-content: space-between;
  align-items: center;

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
`;
