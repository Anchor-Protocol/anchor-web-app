import { Menu, MenuClose, MenuWallet } from '@anchor-protocol/icons';
import { useAirdropCheckQuery } from '@anchor-protocol/webapp-provider';
import { Launch } from '@material-ui/icons';
import { isMathWallet } from '@terra-dev/browser-check';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { IconToggleButton } from '@terra-dev/neumorphism-ui/components/IconToggleButton';
import {
  ConnectType,
  useWallet,
  WalletStatus,
} from '@terra-money/wallet-provider';
import logoUrl from 'components/Header/assets/Logo.svg';
import { AirdropContent } from 'components/Header/WalletSelector/AirdropContent';
import { links, mobileHeaderHeight } from 'env';
import { govPathname } from 'pages/gov/env';
import { useSendDialog } from 'pages/send/useSendDialog';
import React, { useCallback, useState } from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useWalletDetailDialog } from './WalletSelector/useWalletDetailDialog';
import { ViewAddressButton } from './WalletSelector/ViewAddressButton';

export interface MobileHeaderProps {
  className?: string;
}

let _airdropClosed: boolean = false;

function MobileHeaderBase({ className }: MobileHeaderProps) {
  const [open, setOpen] = useState<boolean>(false);

  const { status, connect } = useWallet();

  const [openWalletDetail, walletDetailElement] = useWalletDetailDialog();

  const [openSendDialog, sendDialogElement] = useSendDialog();

  const { data: airdrop, isLoading: airdropIsLoading } = useAirdropCheckQuery();
  //const airdrop = useMemo<Airdrop | 'in-progress' | null>(
  //  () => ({
  //    createdAt: '',
  //    id: 1,
  //    stage: 1,
  //    address: '',
  //    staked: '100000000' as uANC,
  //    total: '100000000' as uANC,
  //    rate: '0.1' as Rate,
  //    amount: '100000000' as uANC,
  //    proof: '',
  //    merkleRoot: '',
  //    claimable: true,
  //  }),
  //  [],
  //);

  const matchAirdrop = useRouteMatch('/airdrop');

  const [airdropClosed, setAirdropClosed] = useState(() => _airdropClosed);

  const closeAirdrop = useCallback(() => {
    setAirdropClosed(true);
    _airdropClosed = true;
  }, []);

  const toggleWallet = useCallback(() => {
    if (status === WalletStatus.WALLET_CONNECTED) {
      openWalletDetail({
        openSend: () => openSendDialog({}),
      });
    } else if (status === WalletStatus.WALLET_NOT_CONNECTED) {
      connect(
        isMathWallet(navigator.userAgent)
          ? ConnectType.CHROME_EXTENSION
          : ConnectType.WALLETCONNECT,
      );
    }
  }, [connect, openSendDialog, openWalletDetail, status]);

  const viewAddress = useCallback(() => {
    setOpen(false);

    if (status === WalletStatus.WALLET_NOT_CONNECTED) {
      connect(ConnectType.READONLY);
    }
  }, [connect, status]);

  return (
    <>
      <header className={className} data-open={open}>
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

            {status === WalletStatus.WALLET_NOT_CONNECTED && (
              <ViewAddressButton onClick={viewAddress} />
            )}
          </nav>
        )}
        <section className="header">
          <a
            className="logo"
            href="https://anchorprotocol.com/dashboard"
            target="_blank"
            rel="noreferrer"
          >
            <img src={logoUrl} alt="logo" />
          </a>

          <div />

          {/*<MobileNotification className="notification" />*/}

          <IconToggleButton
            on={!!walletDetailElement}
            onChange={(open) => {
              open && toggleWallet();
            }}
            onIcon={MenuWallet}
            offIcon={MenuWallet}
          />

          <IconToggleButton
            on={open}
            onChange={setOpen}
            onIcon={MenuClose}
            offIcon={Menu}
          />
        </section>

        {!open &&
          !airdropClosed &&
          airdrop &&
          !airdropIsLoading &&
          !matchAirdrop && (
            <section className="airdrop">
              <AirdropContent onClose={closeAirdrop} isMobileLayout />
            </section>
          )}
      </header>

      {open && <div style={{ height: mobileHeaderHeight }} />}

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
      <NavLink to={to} onClick={close}>
        {title}
      </NavLink>
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
  > section.header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    background-color: #101010;

    a {
      text-decoration: none;
      color: #555555;
    }

    button {
      color: #555555;

      &[data-on='true'] {
        color: #ffffff;
      }
    }

    div:empty {
      flex: 1;
    }
  }

  > nav {
    background-color: #101010;

    > div {
      display: flex;
      align-items: center;

      a:first-child {
        flex: 1;

        font-size: 36px;
        font-weight: 700;
        letter-spacing: -0.2px;
        text-decoration: none;

        color: #666666;

        &.active {
          color: #f4f4f5;
        }
      }

      a:last-child {
        font-size: 16px;
        text-decoration: none;

        color: #666666;

        svg {
          font-size: 1em;
        }
      }
    }
  }

  .airdrop {
    padding-bottom: 20px;
    background-color: ${({ theme }) => theme.backgroundColor};
  }

  // ---------------------------------------------
  // layout
  // ---------------------------------------------
  > section.header {
    position: relative;
    height: ${mobileHeaderHeight}px;
    padding: 0 20px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    a.logo {
      img {
        width: 28px;
        height: 28px;
      }
    }

    .notification {
      margin-right: 15px;
      transform: translateY(4px);
    }

    button {
      &:last-child {
        margin-left: 30px;
      }
    }

    svg {
      font-size: 26px;
    }
  }

  > nav {
    position: absolute;
    top: ${mobileHeaderHeight}px;
    left: 0;
    width: 100vw;
    height: calc(100vh - ${mobileHeaderHeight}px);

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
