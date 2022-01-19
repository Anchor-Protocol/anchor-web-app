import { Tooltip } from '@libs/neumorphism-ui/components/Tooltip';
import { useAccount } from 'contexts/account';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

export interface ViewAddressStrikeProps {
  children: ReactNode;
}

export function ViewAddressWarning({ children }: ViewAddressStrikeProps) {
  const { readonly } = useAccount();

  return readonly ? (
    <Tooltip
      title="Currently in “View an Address” mode. To make transactions, please disconnect and reconnect using Terra Station (extension or mobile)."
      placement="bottom"
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
