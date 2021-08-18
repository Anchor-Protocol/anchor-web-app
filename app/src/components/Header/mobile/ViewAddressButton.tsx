import { AccountBalanceWallet } from '@material-ui/icons';
import React from 'react';
import styled from 'styled-components';

export interface ViewAddressButtonProps {
  className?: string;
  onClick: () => void;
}

function ViewAddressButtonBase({ className, onClick }: ViewAddressButtonProps) {
  return (
    <button className={className} onClick={onClick}>
      <AccountBalanceWallet /> <u>View an address</u>
    </button>
  );
}

export const ViewAddressButton = styled(ViewAddressButtonBase)`
  display: inline-flex;
  text-decoration: none;
  justify-content: flex-start;
  align-items: center;

  width: auto;
  height: 36px;
  outline: none;
  cursor: pointer;
  text-align: left;
  padding: 0;

  background-color: transparent;
  border: 0;
  color: #666666;

  font-size: 13px;
  font-weight: 500;

  svg {
    margin-left: 4px;
    margin-right: 9px;
    font-size: 1em;
    transform: scale(1.4);
  }
`;
