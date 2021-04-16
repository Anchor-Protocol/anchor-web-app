import { truncate as _truncate } from '@anchor-protocol/notation';
import { useWallet } from '@anchor-protocol/wallet-provider';
import React from 'react';
import styled from 'styled-components';

export interface AccountLinkProps {
  address: string;
  truncate?: boolean;
  className?: string;
}

function AccountLinkBase({ address, truncate, className }: AccountLinkProps) {
  const { network } = useWallet();

  return (
    <a
      className={className}
      href={`https://finder.terra.money/${network.chainID}/account/${address}`}
      target="_blank"
      rel="noreferrer"
    >
      {truncate ? _truncate(address) : address}
    </a>
  );
}

export const AccountLink = styled(AccountLinkBase)`
  color: ${({ theme }) => theme.textColor};
`;
