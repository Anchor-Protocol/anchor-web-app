import { MenuWallet } from '@anchor-protocol/icons';
import { fixHMR } from 'fix-hmr';
import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import styled from 'styled-components';

export interface IconOnlyWalletButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  connected?: boolean;
}

function IconOnlyWalletButtonBase({
  connected = false,
  ...buttonProps
}: IconOnlyWalletButtonProps) {
  return (
    <button {...buttonProps} data-connected={connected}>
      <MenuWallet />
    </button>
  );
}

export const StyledIconOnlyWalletButton = styled(IconOnlyWalletButtonBase)`
  background-color: transparent;
  border: none;
  color: ${({ theme }) => theme.dimTextColor};
  opacity: 0.5;
  cursor: pointer;

  svg {
    font-size: 19px;
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.3;
  }

  &[data-connected='true'] {
    color: ${({ theme }) => theme.colors.positive};
    opacity: 1;
  }
`;

export const IconOnlyWalletButton = fixHMR(StyledIconOnlyWalletButton);
