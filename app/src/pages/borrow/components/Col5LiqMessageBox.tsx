import { Close } from '@material-ui/icons';
import { fixHMR } from 'fix-hmr';
import React, { CSSProperties, ReactNode, useCallback, useState } from 'react';
import styled, { DefaultTheme, ThemeProps } from 'styled-components';

const key = (id: string) => `__anchor_hide_message_${id}__`;

export interface MessageBoxProps {
  className?: string;
  children: ReactNode;
  style?: CSSProperties;
  level?: 'error' | 'info';
  hide?: {
    id: string;
    period: number;
  };
}

function MessageBoxBase({ className, style, children, hide }: MessageBoxProps) {
  const [hidden, setHidden] = useState<boolean>(() => {
    if (!hide) {
      return false;
    }

    const end = localStorage.getItem(key(hide.id));

    if (!end) {
      return false;
    }

    return +end > Date.now();
  });

  const updateHidden = useCallback(() => {
    if (!hide) {
      return;
    }

    localStorage.setItem(key(hide.id), (Date.now() + hide.period).toString());

    setHidden(true);
  }, [hide]);

  return !hidden ? (
    <article className={className} style={style}>
      <p>{children}</p>
      {!!hide && (
        <footer>
          <button className="close" onClick={updateHidden}>
            <Close /> Close
          </button>
        </footer>
      )}
    </article>
  ) : null;
}

const defaultLevel = 'error';

const textColor = ({
  theme,
  level = defaultLevel,
}: MessageBoxProps & ThemeProps<DefaultTheme>) =>
  level === 'error' ? theme.colors.negative : '#3e6788';

const StyledMessageBox = styled(MessageBoxBase)`
  border: 1px solid ${textColor};
  border-radius: 10px;
  color: ${textColor};
  padding: 20px;
  margin: 20px 0;

  > p {
    max-width: 1000px;
    text-align: left;
    word-break: break-word;
    white-space: break-spaces;
  }

  > footer {
    margin-top: 1em;

    text-align: right;

    button {
      border: 0;
      outline: none;
      background-color: transparent;

      svg {
        font-size: 1em;
        cursor: pointer;
        transform: scale(1.2) translateY(0.15em);
      }
    }
  }
`;

export const MessageBox = fixHMR(StyledMessageBox);
