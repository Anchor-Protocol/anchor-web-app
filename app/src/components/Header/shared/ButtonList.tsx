import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface ButtonListProps {
  className?: string;
  title?: string;
  footer?: ReactNode;
  children: ReactNode;
}

function ButtonListBase(props: ButtonListProps) {
  const { className, title, footer, children } = props;
  return (
    <section className={className}>
      {title && <h1>{title}</h1>}
      <div className="children">{children}</div>
      {footer && <hr />}
      {footer}
    </section>
  );
}

export const ButtonList = styled(ButtonListBase)`
  padding: 32px 28px;
  display: flex;
  flex-direction: column;

  h1 {
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 16px;
  }

  .children {
    button,
    a {
      width: 100%;
      height: 32px;
      font-size: 12px;
      font-weight: 500;
      margin-bottom: 8px;
      color: ${({ theme }) => theme.textColor};

      &:hover {
        background-color: ${({ theme }) =>
          theme.palette.type === 'light' ? '#f4f4f5' : '#2a2a46'};
        color: ${({ theme }) => theme.textColor};
      }

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

      img {
        width: 1em;
        height: 1em;
      }
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
`;
