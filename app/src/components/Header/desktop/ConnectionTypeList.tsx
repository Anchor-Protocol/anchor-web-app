import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { ButtonList } from '../shared';

interface ConnectionTypeListProps {
  className?: string;
  footer?: ReactNode;
  children: ReactNode;
}

function ConnectionTypeListBase({
  className,
  footer,
  children,
}: ConnectionTypeListProps) {
  return (
    <ButtonList className={className} title="Connect Wallet" footer={footer}>
      {children}
    </ButtonList>
  );
}

export const ConnectionTypeList = styled(ConnectionTypeListBase)`
  .connect {
    background-color: ${({ theme }) =>
      theme.palette.type === 'light' ? '#f4f4f5' : '#2a2a46'};
    color: ${({ theme }) => theme.textColor};
  }

  .install {
    border: 1px solid
      ${({ theme }) =>
        theme.palette.type === 'light' ? '#e7e7e7' : 'rgba(231,231,231, 0.3)'};
    color: ${({ theme }) => theme.textColor};
  }

  .readonly {
    border: 1px solid ${({ theme }) => theme.dimTextColor};
    color: ${({ theme }) => theme.dimTextColor};
  }
`;
