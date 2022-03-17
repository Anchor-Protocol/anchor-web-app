import { useNetwork } from '@anchor-protocol/app-provider';
import { truncate as _truncate } from '@libs/formatter';
import React from 'react';
import styled from 'styled-components';

export interface AccountLinkProps {
  address: string;
  truncate?: boolean;
  className?: string;
  underline?: boolean;
}

function AccountLinkBase({ address, truncate, className }: AccountLinkProps) {
  const { network } = useNetwork();

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
  ${({ underline = false }) =>
    underline ? 'text-decoration: underline !important;' : ''};
`;
