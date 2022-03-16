import { ClickAwayListener } from '@material-ui/core';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { ConnectWalletButton } from './ConnectWalletButton';
import { useBalances } from 'contexts/balances';

export interface WalletSelectorProps {
  className?: string;
  walletAddress?: string;
  initializing: boolean;
  onClick: () => void;
  onClose: () => void;
  children: ReactNode;
}

function WalletSelectorBase(props: WalletSelectorProps) {
  const { walletAddress, initializing, className, onClick, onClose, children } =
    props;

  const { uUST } = useBalances();

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------

  if (initializing) {
    return (
      <div className={className}>
        <ConnectWalletButton initializing={true} onClick={onClick} />
      </div>
    );
  }

  if (!walletAddress) {
    return (
      <ClickAwayListener onClickAway={onClose}>
        <div className={className}>
          <ConnectWalletButton onClick={onClick} />
          {children}
        </div>
      </ClickAwayListener>
    );
  }

  return (
    <ClickAwayListener onClickAway={onClose}>
      <div className={className}>
        <ConnectWalletButton
          walletAddress={walletAddress}
          totalUST={uUST}
          onClick={onClick}
        />
        {children}
      </div>
    </ClickAwayListener>
  );
}

export const WalletSelector = styled(WalletSelectorBase)`
  display: inline-block;
  position: relative;
  text-align: left;
`;
