import { useAirdropCheckQuery } from '@anchor-protocol/app-provider';
import { Menu, MenuClose, MenuWallet } from '@anchor-protocol/icons';
import { IconToggleButton } from '@libs/neumorphism-ui/components/IconToggleButton';
import {
  ConnectType,
  useWallet,
  WalletStatus,
} from '@terra-money/wallet-provider';
import { useMenus, RouteMenu } from 'configurations/menu';
import { mobileHeaderHeight } from 'env';
import { useBuyUstDialog } from 'pages/earn/components/useBuyUstDialog';
import { useSendDialog } from 'pages/send/useSendDialog';
import React, { useCallback, useState } from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { AirdropContent } from './airdrop/AirdropContent';
import logoUrl from './assets/Logo.svg';
import { useWalletDetailDialog } from './mobile/useWalletDetailDialog';
import { ViewAddressButton } from './mobile/ViewAddressButton';

export interface MobileHeaderProps {
  className?: string;
}

let _airdropClosed: boolean = false;

function MobileHeaderBase({ className }: MobileHeaderProps) {
  const menus = useMenus();

  const [open, setOpen] = useState<boolean>(false);

  const { status, connect, isChromeExtensionCompatibleBrowser } = useWallet();

  const [openWalletDetail, walletDetailElement] = useWalletDetailDialog();

  const [openSendDialog, sendDialogElement] = useSendDialog();

  const [openBuyUstDialog, buyUstDialogElement] = useBuyUstDialog();

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
        openBuyUst: () => openBuyUstDialog({}),
      });
    } else if (status === WalletStatus.WALLET_NOT_CONNECTED) {
      connect(
        isChromeExtensionCompatibleBrowser()
          ? ConnectType.EXTENSION
          : ConnectType.WALLETCONNECT,
      );
    }
  }, [
    connect,
    isChromeExtensionCompatibleBrowser,
    openBuyUstDialog,
    openSendDialog,
    openWalletDetail,
    status,
  ]);

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
            {menus.map((itemMenu) => (
              <NavMenu
                key={'menu-' + itemMenu.to}
                {...itemMenu}
                close={() => setOpen(false)}
              />
            ))}

            {status === WalletStatus.WALLET_NOT_CONNECTED && (
              <ViewAddressButton onClick={viewAddress} />
            )}
          </nav>
        )}
        <section className="header">
          <a
            className="logo"
            href="https://anchorprotocol.com"
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
      {buyUstDialogElement}
    </>
  );
}

function NavMenu({
  to,
  exact,
  title,
  close,
}: RouteMenu & {
  close: () => void;
}) {
  const match = useRouteMatch({
    path: to,
    exact,
  });

  return (
    <div data-active={!!match}>
      <NavLink to={to} exact={exact} onClick={close}>
        {title}
      </NavLink>
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

      a {
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
    }
  }

  .airdrop {
    padding-bottom: 20px;
    background-color: ${({ theme }) => theme.sectionBackgroundColor};
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
