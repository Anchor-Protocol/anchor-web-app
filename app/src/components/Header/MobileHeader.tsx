import { Menu, MenuClose, Wallet } from '@anchor-protocol/icons';
import {
  ConnectType,
  useWallet,
  WalletStatus,
} from '@anchor-protocol/wallet-provider2';
import { IconButton } from '@material-ui/core';
import { Launch } from '@material-ui/icons';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { IconToggleButton } from '@terra-dev/neumorphism-ui/components/IconToggleButton';
import { useTheme } from 'base/contexts/theme';
import { onProduction } from 'base/env';
import logoUrl from 'components/Header/assets/Logo.svg';
import { useWalletDetailDialog } from 'components/Header/WalletSelector/useWalletDetailDialog';
import { headerHeight, links } from 'env';
import { govPathname } from 'pages/gov/env';
import { useSendDialog } from 'pages/send/useSendDialog';
import React, { useCallback, useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

export interface MobileHeaderProps {
  className?: string;
}

function MobileHeaderBase({ className }: MobileHeaderProps) {
  const [open, setOpen] = useState<boolean>(false);

  const { themeColor } = useTheme();

  const { status, connect } = useWallet();

  const [openWalletDetail, walletDetailElement] = useWalletDetailDialog();

  const [openSendDialog, sendDialogElement] = useSendDialog();

  const toggleWallet = useCallback(() => {
    if (status === WalletStatus.WALLET_CONNECTED) {
      openWalletDetail({
        openSend: () => openSendDialog({}),
      });
    } else if (status === WalletStatus.WALLET_NOT_CONNECTED) {
      connect(ConnectType.WALLETCONNECT);
    }
  }, [connect, openSendDialog, openWalletDetail, status]);

  return (
    <>
      <header
        className={className}
        data-dark={themeColor === 'dark'}
        data-open={open}
      >
        {open && (
          <nav>
            <NavMenu
              to="/earn"
              title="EARN"
              docsTo={links.earn}
              close={() => setOpen(false)}
            />
            <NavMenu
              to="/borrow"
              title="BORROW"
              docsTo={links.borrow}
              close={() => setOpen(false)}
            />
            <NavMenu
              to="/bond"
              title="BOND"
              docsTo={links.bond}
              close={() => setOpen(false)}
            />
            <NavMenu
              to={`/${govPathname}`}
              title="GOVERN"
              docsTo={links.gov}
              close={() => setOpen(false)}
            />
          </nav>
        )}
        <section>
          <a
            className="logo"
            href={
              onProduction
                ? 'https://anchorprotocol.com'
                : 'https://dev.anchor.money'
            }
          >
            <img src={logoUrl} alt="logo" />
          </a>

          <div />

          <IconButton onClick={toggleWallet}>
            <Wallet />
          </IconButton>

          <IconToggleButton
            on={open}
            onChange={setOpen}
            onIcon={MenuClose}
            offIcon={Menu}
          />
        </section>
      </header>

      {open && <div style={{ height: headerHeight }} />}

      {walletDetailElement}
      {sendDialogElement}
    </>
  );
}

function NavMenu({
  to,
  docsTo,
  title,
  close,
}: {
  to: string;
  docsTo: string;
  title: string;
  close: () => void;
}) {
  const match = useRouteMatch(to);

  return (
    <div data-active={!!match}>
      <Link to={to} onClick={close}>
        {title}
      </Link>
      <a href={docsTo} target="_blank" rel="noreferrer" onClick={close}>
        <IconSpan>
          Docs <Launch />
        </IconSpan>
      </a>
    </div>
  );
}

const slide = keyframes`
  0% {
    transform: translateY(-100%);
    opacity: 0.7;
  }
  
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const MobileHeader = styled(MobileHeaderBase)`
  // ---------------------------------------------
  // style
  // ---------------------------------------------
  > section {
    display: flex;
    align-items: center;
    justify-content: space-between;

    background-color: #ffffff;

    a {
      text-decoration: none;
      color: #333333;
    }

    button {
      color: #333333;

      &:last-child {
        margin-left: 10px;
      }
    }

    div:empty {
      flex: 1;
    }
  }

  > nav {
    background-color: #ffffff;

    > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    a:first-child {
      font-size: 36px;
      font-weight: 700;
      letter-spacing: -0.2px;
      text-decoration: none;

      color: #696969;

      &:hover {
        color: #515151;
      }

      &.active {
        color: #333333;
      }
    }

    a:last-child {
      font-size: 16px;
      text-decoration: none;

      color: #696969;

      svg {
        font-size: 1em;
      }
    }
  }

  &[data-dark='true'] {
    > section {
      background-color: #000000;

      a {
        color: rgba(255, 255, 255, 0.5);
      }
    }

    nav {
      background-color: #000000;

      a:first-child {
        color: rgba(255, 255, 255, 0.35);

        &:hover {
          color: rgba(255, 255, 255, 0.5);
        }

        &.active {
          color: rgba(255, 255, 255, 0.6);
        }
      }
    }
  }

  // ---------------------------------------------
  // layout
  // ---------------------------------------------
  > section {
    position: relative;
    height: ${headerHeight}px;
    padding: 0 24px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    a.logo {
      img {
        width: 32px;
        height: 32px;
      }
    }

    svg {
      font-size: 32px;
    }
  }

  > nav {
    position: absolute;
    top: ${headerHeight}px;
    left: 0;
    width: 100vw;
    height: calc(100vh - ${headerHeight}px);

    display: flex;
    flex-direction: column;
    padding: 24px;

    a {
      margin-bottom: 12px;
    }

    button {
      margin-top: 30px;
    }

    animation: ${slide} 0.3s cubic-bezier(0.655, 1.075, 0.8, 0.995);
  }

  &[data-open='true'] {
    position: fixed;
    z-index: 10000;
    top: 0;
    width: 100vw;
  }
`;
