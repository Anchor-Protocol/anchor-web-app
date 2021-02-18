import logoUrl from '@anchor-protocol/icons/assets/Anchor.svg';
import { WalletSelector } from 'components/Header/WalletSelector';
import { screen } from 'env';
import React from 'react';
import { NavLink } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

export interface HeaderProps {
  className?: string;
}

function HeaderBase({ className }: HeaderProps) {
  return (
    <header className={className}>
      <nav className="menu">
        <NavLink to="/earn">EARN</NavLink>
        <NavLink to="/borrow">BORROW</NavLink>
        <NavLink to="/basset">bASSET</NavLink>
      </nav>

      <section className="wallet">
        <WalletSelector />
      </section>

      <GlobalStyle />
    </header>
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
const mobileLayoutBreak = 860;

export const Header = styled(HeaderBase)`
  // ---------------------------------------------
  // style
  // ---------------------------------------------
  background-color: #000000;

  a {
    text-decoration: none;
  }

  .menu {
    a {
      display: inline-block;

      font-weight: 900;

      color: rgba(255, 255, 255, 0.12);

      border-bottom-color: transparent;

      position: relative;

      transition: color 0.3s ease-out, border-bottom-color 0.4s ease-out;

      &:hover {
        color: rgba(255, 255, 255, 0.3);
      }

      &.active {
        color: #ffffff;

        border-bottom-color: #ffffff;
      }
    }
  }

  // ---------------------------------------------
  // layout
  // ---------------------------------------------
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  @media (min-width: ${desktopLayoutBreak}px) {
    height: 144px;
    padding: 0 100px;

    .menu {
      word-break: keep-all;
      white-space: nowrap;

      a {
        border-bottom-style: solid;
        border-bottom-width: 7px;

        padding-bottom: 13px;

        &:not(:last-child) {
          margin-right: 38px;
        }

        font-size: 34px;

        &.active {
          &::before {
            position: absolute;
            left: 0;
            top: -54px;
            content: '';
            width: 100px;
            height: 100px;
            background: url('${logoUrl}') no-repeat;
          }
        }
      }
    }

    .wallet {
      padding-bottom: 15px;
      text-align: right;
    }
  }

  @media (max-width: ${desktopLayoutBreak}px) {
    height: 80px;
    padding: 0 80px;

    .menu {
      a {
        border-bottom-style: solid;
        border-bottom-width: 7px;

        padding-bottom: 13px;

        &:not(:last-child) {
          margin-right: 28px;
        }

        font-size: 27px;
      }
    }

    .wallet {
      padding-bottom: 12px;
      text-align: right;
    }
  }

  @media (max-width: ${mobileLayoutBreak}px) {
    align-items: center;

    height: 60px;
    padding: 0;

    .menu {
      display: flex;
      justify-content: space-evenly;
      width: 100%;

      a {
        border: none;
        padding-bottom: 0;
        font-size: 18px;

        &:not(:last-child) {
          margin-right: 0;
        }
      }
    }

    .wallet {
      display: none;
    }
  }
`;
