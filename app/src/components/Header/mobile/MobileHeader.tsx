import { Menu, MenuClose, MenuWallet } from '@anchor-protocol/icons';
import { IconToggleButton } from '@libs/neumorphism-ui/components/IconToggleButton';
import { useMenus, RouteMenu } from 'configurations/menu';
import { mobileHeaderHeight } from 'env';
import React, { ReactNode } from 'react';
import { NavLink, useMatch } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import LogoAvax from '../assets/LogoAvax.svg';
// import LogoEth from '../assets/LogoEth.svg';
import LogoTerra from '../assets/LogoTerra.svg';
import { DeploymentSwitch } from 'components/layouts/DeploymentSwitch';

export interface MobileHeaderProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  isActive: boolean;
  toggleWallet: () => void;
  airdropElement?: ReactNode;
  vestingClaimNotificationElement?: ReactNode;
  viewAddressButtonElement?: ReactNode;
  className?: string;
}

function MobileHeaderBase({
  open,
  setOpen,
  isActive,
  toggleWallet,
  airdropElement,
  vestingClaimNotificationElement,
  className,
  viewAddressButtonElement,
}: MobileHeaderProps) {
  const menus = useMenus();

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

            {viewAddressButtonElement}
          </nav>
        )}
        <section className="header">
          <a
            className="logo"
            href="https://anchorprotocol.com"
            target="_blank"
            rel="noreferrer"
          >
            <DeploymentSwitch
              terra={() => <img src={LogoTerra} alt="terraLogo" />}
              ethereum={() => <img src={LogoAvax} alt="avaxLogo" />}
            />
          </a>

          <div />

          {/*<MobileNotification className="notification" />*/}

          <IconToggleButton
            on={isActive}
            onChange={(open) => open && toggleWallet()}
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

        {airdropElement && (
          <section className="airdrop">{airdropElement}</section>
        )}
        {vestingClaimNotificationElement}
      </header>

      {open && <div style={{ height: mobileHeaderHeight }} />}
    </>
  );
}

function NavMenu({
  to,
  title,
  close,
}: RouteMenu & {
  close: () => void;
}) {
  const match = useMatch({
    path: to,
  });

  return (
    <div data-active={!!match}>
      <NavLink to={to} onClick={close}>
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

    background-color: ${({ theme }) => theme.header.backgroundColor};

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
