import { CSSProperties, ReactNode } from 'react';
import styled from 'styled-components';

export interface WarningMessageProps {
  className?: string;
  children: ReactNode;
  style?: CSSProperties;
}

function WarningMessageBase({
  className,
  style,
  children,
}: WarningMessageProps) {
  return (
    <article className={className} style={style}>
      {children}
    </article>
  );
}

export const WarningMessage = styled(WarningMessageBase)`
  border: 1px solid ${({ theme }) => theme.errorTextColor};
  border-radius: 10px;
  color: ${({ theme }) => theme.errorTextColor};
  padding: 10px;
  margin: 20px 0;
  text-align: center;
`;
