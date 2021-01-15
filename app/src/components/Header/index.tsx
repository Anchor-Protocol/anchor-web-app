import { Notifications } from 'components/Header/Notifications';
import { WalletSelector } from 'components/Header/WalletSelector';
import { screen } from 'env';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

export interface HeaderProps {
  className?: string;
}

function HeaderBase({ className }: HeaderProps) {
  return (
    <header className={className}>
      <section className="logo">
        <Link to="/">ANCHOR</Link>
      </section>
      <nav className="menu">
        <NavLink to="/earn">EARN</NavLink>
        <NavLink to="/borrow">BORROW</NavLink>
        <NavLink to="/basset">bASSET</NavLink>
      </nav>
      <section className="wallet">
        <Notifications />
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
const mobileLayoutBreak = 550;

export const Header = styled(HeaderBase)`
  // ---------------------------------------------
  // style
  // ---------------------------------------------
  background-color: rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);

  a {
    text-decoration: none;
  }

  .menu {
    a {
      font-weight: 500;
      color: rgba(255, 255, 255, 0.3);

      &:hover {
        color: rgba(255, 255, 255, 0.6);
      }

      &.active {
        font-weight: 900;
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }

  .logo {
    a {
      font-size: 13px;
      font-weight: 900;
      color: rgba(255, 255, 255, 0.8);
    }
  }

  // ---------------------------------------------
  // layout
  // ---------------------------------------------
  @media (min-width: ${desktopLayoutBreak}px) {
    height: 74px;
    padding: 0 80px;

    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: center;

    .menu {
      display: flex;
      justify-content: center;

      a {
        &:not(:last-child) {
          margin-right: 54px;
        }

        font-size: 13px;
      }
    }

    .wallet {
      text-align: right;
    }
  }

  @media (max-width: ${desktopLayoutBreak}px) {
    height: 74px;
    padding: 0 80px;
    
    display: flex;
    justify-content: space-between;
    align-items: center;

    .menu {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;

      height: 50px;
      z-index: 10000;
      
      font-size: 13px;

      background-color: black;

      display: grid;
      grid-template-columns: repeat(3, auto);
      justify-content: space-evenly;
      align-items: center;
    }
  }
  
  @media (max-width: ${mobileLayoutBreak}px) {
    justify-content: center;
    
    .wallet {
      display: none;
    }
  }
`;
