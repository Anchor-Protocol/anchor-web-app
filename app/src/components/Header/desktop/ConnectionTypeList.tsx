import React, { ReactNode } from 'react';
import styled from 'styled-components';

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
    <section className={className}>
      <h1>Connect Wallet</h1>
      {children}
      {footer && <hr />}
      {footer}
    </section>
  );
}

export const ConnectionTypeList = styled(ConnectionTypeListBase)`
  padding: 32px 28px;

  display: flex;
  flex-direction: column;

  h1 {
    font-size: 16px;
    font-weight: bold;

    text-align: center;
    margin-bottom: 16px;
  }

  button,
  a {
    width: 100%;
    height: 32px;

    font-size: 12px;
    font-weight: 500;

    > span {
      width: 100%;
      padding: 0 15px 1px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      img {
        transform: scale(1.1);
      }
    }

    &.connect,
    &.install {
      margin-bottom: 8px;
    }

    img {
      width: 1em;
      height: 1em;
    }
  }

  hr {
    margin: 12px 0;

    border: 0;
    border-bottom: 1px dashed
      ${({ theme }) =>
        theme.palette.type === 'light'
          ? '#e5e5e5'
          : 'rgba(255, 255, 255, 0.1)'};
  }

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
