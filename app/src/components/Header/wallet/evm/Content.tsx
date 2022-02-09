import React from 'react';
import { Connection } from '@libs/evm-wallet';
import { WalletContent } from '../WalletContent';
import { UIElementProps } from '@libs/ui';
import { HumanAddr } from '@libs/types';
import styled from 'styled-components';
import { TokenList } from '../TokenList';

type Action = () => void;

interface ContentProps extends UIElementProps {
  walletAddress: HumanAddr;
  connection: Connection;
  onClose: Action;
  onDisconnectWallet: Action;
}

const ContentBase = (props: ContentProps) => {
  const { className, walletAddress, connection, onClose, onDisconnectWallet } =
    props;

  return (
    <WalletContent
      className={className}
      walletAddress={walletAddress}
      connectionName={connection.name}
      connectionIcon={connection.icon}
      readonly={false}
      onDisconnectWallet={onDisconnectWallet}
    >
      <TokenList onClose={onClose} />
    </WalletContent>
  );
};

export const Content = styled(ContentBase)``;
