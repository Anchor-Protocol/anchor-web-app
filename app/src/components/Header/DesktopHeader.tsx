import { menus, RouteMenu } from 'configurations/menu';
import { screen } from 'env';
import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import logoUrl from './assets/Logo.svg';
// import { DesktopNotification } from './desktop/DesktopNotification';
// import { WalletSelector } from './desktop/WalletSelector';

import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import('@solana/wallet-adapter-react-ui/styles.css');

export interface DesktopHeaderProps {
  className?: string;
}

function DesktopHeaderBase({ className }: DesktopHeaderProps) {
  return (
    <header className={className}>
      <a
        className="logo"
        href="https://anchorprotocol.com/"
        target="_blank"
        rel="noreferrer"
      >
        <img src={logoUrl} alt="logo" />
      </a>

      <nav className="menu">
        {menus.map((itemMenu) => (
          <NavMenu key={'menu-' + itemMenu.to} {...itemMenu} />
        ))}
      </nav>

      <div />

      {/* <DesktopNotification className="notification" /> */}

      <section className="wallet">
        <WalletModalProvider>
          <WalletMultiButton />
          <WalletDisconnectButton />
        </WalletModalProvider>
      </section>

      <GlobalStyle />
    </header>
  );
}

function NavMenu({ to, exact, title }: RouteMenu) {
  const match = useRouteMatch({
    path: to,
    exact,
  });

  return (
    <div data-active={!!match}>
      <Link to={to}>{title}</Link>
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

export const DesktopHeader = styled(DesktopHeaderBase)`
  // ---------------------------------------------
  // style
  // ---------------------------------------------
  background-color: #000000;

  a {
    text-decoration: none;
  }

  .menu {
    > div {
      padding: 6px 12px;

      display: flex;
      align-items: center;

      a {
        color: rgba(255, 255, 255, 0.4);
        font-size: 18px;
        font-weight: 900;

        text-decoration: none;
      }

      &[data-active='true'] {
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        background: ${({ theme }) => theme.backgroundColor};

        opacity: 1;

        a {
          color: ${({ theme }) => theme.textColor};
        }
      }
    }
  }

  // ---------------------------------------------
  // layout
  // ---------------------------------------------
  display: flex;
  //justify-content: space-between;
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

  > div:empty {
    flex: 1;
  }

  .notification {
    margin-right: 5px;
  }

  .wallet {
    display: flex;
    padding-bottom: 8px;
    text-align: right;
  }

  .logo {
    position: absolute;
    top: 18px;
    left: 100px;

    transition: transform 0.17s ease-in-out;
    transform-origin: center;

    &:hover {
      transform: scale(1.1);
    }
  }

  @media (min-width: ${desktopLayoutBreak}px) {
    padding: 0 100px;
  }

  @media (max-width: ${desktopLayoutBreak}px) {
    padding: 0 100px;
  }

  @media (max-width: ${mobileLayoutBreak}px) {
    justify-content: space-between;

    padding: 0 40px;

    .logo {
      left: 40px;
    }

    //.wallet {
    //  display: none;
    //}
  }
`;
