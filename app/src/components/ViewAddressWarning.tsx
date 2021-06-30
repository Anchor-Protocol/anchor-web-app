import { Tooltip } from '@terra-dev/neumorphism-ui/components/Tooltip';
import { ConnectType, useConnectedWallet } from '@terra-money/wallet-provider';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

export interface ViewAddressStrikeProps {
  children: ReactNode;
}

export function ViewAddressWarning({ children }: ViewAddressStrikeProps) {
  const connectedWallet = useConnectedWallet();

  return connectedWallet?.connectType === ConnectType.READONLY ? (
    <Tooltip
      title="Wallet is connected as 'View an Address'. Could not execute transaction."
      placement="bottom"
      color="warning"
    >
      <Warning>{children}</Warning>
    </Tooltip>
  ) : (
    <>{children}</>
  );
}

const Warning = styled.div`
  button {
    text-decoration: line-through;
  }
`;
