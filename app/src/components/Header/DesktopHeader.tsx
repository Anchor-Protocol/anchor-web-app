import { DeploymentSwitch } from 'components/layouts/DeploymentSwitch';
import { useMenus, RouteMenu } from 'configurations/menu';
import { screen } from 'env';
import React from 'react';
import { Link, useMatch } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import LogoAvax from './assets/LogoAvax.svg';
import LogoEth from './assets/LogoEth.svg';
import LogoTerra from './assets/LogoTerra.svg';
import { ChainSelector } from './chain/ChainSelector';
import { DesktopNotification } from './desktop/DesktopNotification';
import { TransactionWidget } from './transactions/TransactionWidget';
import { EvmWalletSelector } from './wallet/evm/EvmWalletSelector';
import { TerraWalletSelector } from './wallet/terra/TerraWalletSelector';

export interface DesktopHeaderProps {
  className?: string;
}

function DesktopHeaderBase({ className }: DesktopHeaderProps) {
  const menus = useMenus();
  return (
    <header className={className}>
      <a
        className="logo"
        href="https://anchorprotocol.com/"
        target="_blank"
        rel="noreferrer"
      >
        <DeploymentSwitch
          terra={() => <img src={LogoTerra} alt="terraLogo" />}
          ethereum={() => <img src={LogoEth} alt="ethLogo" />}
          avalanche={() => <img src={LogoAvax} alt="avaxLogo" />}
        />
      </a>

      <nav className="menu">
        {menus.map((itemMenu) => (
          <NavMenu key={'menu-' + itemMenu.to} {...itemMenu} />
        ))}
      </nav>

      <div />

      <DesktopNotification className="notification" />

      <section className="wallet">
        <TransactionWidget className="transaction-widget" />
        <ChainSelector className="chain-selector" />
        <DeploymentSwitch
          terra={() => <TerraWalletSelector />}
          ethereum={() => <EvmWalletSelector />}
        />
      </section>

      <GlobalStyle />
    </header>
  );
}

function NavMenu({ to, title }: RouteMenu) {
  const match = useMatch({
    path: to,
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
  background-color: ${({ theme }) => theme.header.backgroundColor};

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
    padding-bottom: 8px;
    text-align: right;

    .chain-selector {
      margin-right: 5px;
    }

    .transaction-widget {
      margin-right: 5px;
    }
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
