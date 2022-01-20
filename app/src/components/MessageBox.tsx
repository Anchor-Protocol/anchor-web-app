import { Close } from '@material-ui/icons';
import React, { CSSProperties, ReactNode, useCallback, useState } from 'react';
import styled, { DefaultTheme, ThemeProps } from 'styled-components';

const key = (id: string) => `__anchor_hide_message_${id}__`;

export interface MessageBoxProps {
  className?: string;
  icon?: ReactNode;
  children: ReactNode;
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
    <article className={className} style={style}>
      {icon}
      <p className={icon ? 'padded' : ''}>{children}</p>
      {!!hide && <Close className="close" onClick={updateHidden} />}
    </article>
  ) : null;
}

const defaultLevel = 'error';

const textColor = ({
  theme,
  level = defaultLevel,
}: MessageBoxProps & ThemeProps<DefaultTheme>) =>
  level === 'error' ? theme.colors.negative : '#3e6788';

export const MessageBox = styled(MessageBoxBase)`
  border: 1px solid ${textColor};
  border-radius: 10px;
  color: ${textColor};
  padding: 10px;
  margin: 20px 0;

  display: flex;
  align-items: center;

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
    ${({ theme }) => (theme.palette.type === 'dark' ? 'color: skyblue' : '')};
  }
`;
