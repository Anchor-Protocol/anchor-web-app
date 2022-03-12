import { Close } from '@material-ui/icons';
import React, { CSSProperties, ReactNode, useCallback, useState } from 'react';
import styled from 'styled-components';

const key = (id: string) => `__anchor_hide_message_${id}__`;

export interface MessageBoxProps {
  className?: string;
  icon?: ReactNode;
  children: ReactNode;
  variant?: 'normal' | 'highlight';
  textAlign?: 'center' | 'left';
  style?: CSSProperties;
  level?: 'error' | 'info';
  hide?: {
    id: string;
    period: number;
  };
}

function MessageBoxBase({
  className,
  icon,
  style,
  children,
  variant = 'normal',
  textAlign = 'center',
  hide,
}: MessageBoxProps) {
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
    <article
      className={className}
      style={style}
      data-variant={variant}
      data-textalign={textAlign}
    >
      {icon}
      <p className={icon ? 'padded' : ''}>{children}</p>
      {!!hide && <Close className="close" onClick={updateHidden} />}
    </article>
  ) : null;
}

export const MessageBox = styled(MessageBoxBase)`
  border: 1px solid ${({ theme }) => theme.messageBox.borderColor};
  border-radius: 10px;
  color: ${({ theme }) => theme.messageBox.textColor};
  padding: 10px;
  margin: 20px 0;
  display: flex;
  align-items: center;

  &[data-variant='highlight'] {
    border: solid 1px ${({ theme }) => theme.messageBox.borderColor};
    background-color: ${({ theme }) => theme.messageBox.backgroundColor};
    color: ${({ theme }) => theme.messageBox.textColor};
  }

  &[data-textalign='left'] {
    > p {
      text-align: left;
    }
  }

  > p {
    flex: 1;
    text-align: center;
    word-break: break-word;
    white-space: break-spaces;
    &.padded {
      margin-left: 4px;
    }
  }

  > svg {
    font-size: 15px;
    cursor: pointer;
    margin-left: 1em;
  }

  a {
    ${({ theme }) =>
      theme.messageBox.linkColor === 'dark' ? 'color: skyblue' : ''};
  }
`;
