import React from 'react';
import { IconOnlyWalletButton } from 'components/Header/desktop/IconOnlyWalletButton';
import { useMediaQuery } from 'react-responsive';
import { ConnectedButton } from './ConnectedButton';
import { NotConnectedButton } from './NotConnectedButton';
import { u, UST } from '@anchor-protocol/types';

export interface ConnectWalletButtonProps {
  initializing?: boolean;
  walletAddress?: string;
  totalUST?: u<UST>;
  onClick: () => void;
}

export function ConnectWalletButton({
  initializing = false,
  walletAddress,
  totalUST = '0' as u<UST>,
  onClick,
}: ConnectWalletButtonProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const isSmallScreen = useMediaQuery({ query: '(max-width: 1000px)' });

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------

  if (initializing) {
    return isSmallScreen ? (
      <IconOnlyWalletButton disabled />
    ) : (
      <NotConnectedButton disabled>Initializing Wallet...</NotConnectedButton>
    );
  }

  if (!walletAddress) {
    return isSmallScreen ? (
      <IconOnlyWalletButton onClick={onClick} />
    ) : (
      <NotConnectedButton onClick={onClick}>Connect Wallet</NotConnectedButton>
    );
  }

  return isSmallScreen ? (
    <IconOnlyWalletButton onClick={onClick} connected />
  ) : (
    <ConnectedButton
      walletAddress={walletAddress}
      totalUST={totalUST}
      onClick={onClick}
    />
  );
}
