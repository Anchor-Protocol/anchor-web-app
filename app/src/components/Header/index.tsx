import { Launch } from '@material-ui/icons';
import { WalletSelector } from 'components/Header/WalletSelector';
import { useConstants } from 'contexts/contants';
import { screen } from 'env';
import { govPathname } from 'pages/gov/env';
import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import logoUrl from './assets/Logo.svg';

export interface HeaderProps {
  className?: string;
}

function HeaderBase({ className }: HeaderProps) {
  const { isDemo } = useConstants();

  return (
    <header className={className}>
      <a className="logo" href="https://anchorprotocol.com">
        <img src={logoUrl} alt="logo" />
      </a>

      <nav className="menu">
        <NavMenu
          to="/earn"
          title="EARN"
          docsTo="https://anchor-protocol.gitbook.io/anchor-2/user-guide/earn"
        />
        <NavMenu
          to="/borrow"
          title="BORROW"
          docsTo="https://anchor-protocol.gitbook.io/anchor-2/user-guide/borrow"
        />
        <NavMenu
          to="/bond"
          title="BOND"
          docsTo="https://anchor-protocol.gitbook.io/anchor-2/user-guide/basset"
        />
        {!isDemo && (
          <NavMenu
            to={`/${govPathname}`}
            title="GOVERN"
            docsTo="https://anchor-protocol.gitbook.io/anchor-2/user-guide/govern"
          />
        )}
      </nav>

      <section className="wallet">
        <WalletSelector />
      </section>

      <GlobalStyle />
    </header>
  );
}

function NavMenu({
  to,
  docsTo,
  title,
  className,
}: {
  className?: string;
  to: string;
  docsTo: string;
  title: string;
}) {
  const match = useRouteMatch(to);

  return (
    <div className={className} data-active={!!match}>
      <Link to={to}>{title}</Link>
      <a href={docsTo} target="_blank" rel="noreferrer">
        Docs
        <Launch />
      </a>
    </div>
  );
}

const GlobalStyle = createGlobalStyle`
  @media (max-width: ${screen.tablet.max}px) {
    body {
      padding-bottom: 60px;
    }
  }
`;

const desktopLayoutBreak = 1180;
const mobileLayoutBreak = 950;

export const Header = styled(HeaderBase)`
  // ---------------------------------------------
  // style
  // ---------------------------------------------
  background-color: #000000;

  a {
    text-decoration: none;
  }

  .menu {
    > div {
      padding: 6px 17px;

      display: flex;
      align-items: center;

      a {
        color: rgba(255, 255, 255, 0.4);
      }

      a:first-child {
        font-size: 18px;
        font-weight: 900;

        text-decoration: none;
      }

      a:last-child {
        display: none;

        font-size: 12px;
        font-weight: 500;

        text-decoration: none;

        position: relative;

        svg {
          margin-left: 2px;
          font-size: 1em;
          transform: translateY(2px);
        }
      }

      &[data-active='true'] {
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        background: ${({ theme }) => theme.backgroundColor};

        opacity: 1;

        a {
          color: ${({ theme }) => theme.textColor};
        }

        a:last-child {
          display: inline-block;

          margin-left: 17px;

          &::before {
            content: '';
            display: block;

            position: absolute;

            background-color: ${({ theme }) => theme.colors.positive};

            width: 1px;
            height: 18px;

            left: -8px;
            top: -1px;
          }
        }
      }
    }
  }

  // ---------------------------------------------
  // layout
  // ---------------------------------------------
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  height: 88px;

  .menu {
    word-break: keep-all;
    white-space: nowrap;

    display: flex;

    > div {
      a:first-child {
        font-size: 18px;
      }
    }
  }

  .wallet {
    padding-bottom: 8px;
    text-align: right;
  }

  .logo {
    position: absolute;
    top: 18px;
    left: 100px;
  }

  @media (min-width: ${desktopLayoutBreak}px) {
    padding: 0 100px;
  }

  @media (max-width: ${desktopLayoutBreak}px) {
    padding: 0 100px;
  }

  @media (max-width: ${mobileLayoutBreak}px) {
    justify-content: center;

    .wallet {
      display: none;
    }
  }
`;
