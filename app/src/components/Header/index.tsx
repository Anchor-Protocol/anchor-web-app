import { WalletSelector } from 'components/Header/WalletSelector';
import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { Logo } from './Logo';

export interface HeaderProps {
  className?: string;
}

function HeaderBase({ className }: HeaderProps) {
  return (
    <header className={className}>
      <div>
        <Logo />
      </div>
      <nav>
        <NavLink to="/earn">EARN</NavLink>
        <NavLink to="/borrow">BORROW</NavLink>
        <NavLink to="/basset/mint">bASSET</NavLink>
      </nav>
      <div>
        <WalletSelector />
      </div>
    </header>
  );
}

export const Header = styled(HeaderBase)`
  // ---------------------------------------------
  // style
  // ---------------------------------------------
  background-color: rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);

  a {
    text-decoration: none;
  }

  nav {
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

  // ---------------------------------------------
  // layout
  // ---------------------------------------------
  // TODO responsive layout
  //@media (min-width: {screen.tablet.max}px) {
  height: 74px;
  padding: 0 80px;

  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;

  nav {
    display: flex;
    justify-content: center;

    a {
      &:not(:last-child) {
        margin-right: 54px;
      }

      font-size: 13px;
    }
  }

  > :last-child {
    text-align: right;
  }

  //}
  //
  //@media (max-width: {screen.tablet.max}px) {
  //}
`;
