import { useEvmWallet } from '@libs/web3-react';
import { ClickAwayListener } from '@material-ui/core';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { DropdownBox, DropdownContainer } from './DropdownContainer';
import { u, UST } from '@anchor-protocol/types';
import { ConnectWalletButton } from './ConnectWalletButton';

export interface WalletSelectorProps {
  className?: string;
  initializing: boolean;
  open: boolean;
  onClick: () => void;
  onClose: () => void;
  children: ReactNode;
}

//let _airdropClosed: boolean = false;

function WalletSelectorBase({
  className,
  initializing,
  open,
  onClick,
  onClose,
  children,
}: WalletSelectorProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------

  const { address, isActivating } = useEvmWallet();
  const totalUST = '999999000' as u<UST>;

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------

  if (isActivating) {
    return (
      <div className={className}>
        <ConnectWalletButton initializing={true} onClick={onClick} />
      </div>
    );
  }

  if (!address) {
    return (
      <ClickAwayListener onClickAway={onClose}>
        <div className={className}>
          <ConnectWalletButton onClick={onClick} />
          {open && (
            <DropdownContainer>
              <DropdownBox>{children}</DropdownBox>
            </DropdownContainer>
          )}
        </div>
      </ClickAwayListener>
    );
  }

  return (
    <ClickAwayListener onClickAway={onClose}>
      <div className={className}>
        <ConnectWalletButton
          walletAddress={address}
          totalUST={totalUST}
          onClick={onClick}
        />
        {open && (
          <DropdownContainer>
            <DropdownBox>{children}</DropdownBox>
          </DropdownContainer>
        )}
      </div>
    </ClickAwayListener>
  );
}

export const WalletSelector = styled(WalletSelectorBase)`
  display: inline-block;
  position: relative;
  text-align: left;
`;
