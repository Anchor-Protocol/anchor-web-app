import { truncate } from '@libs/formatter';
import React from 'react';
import { getAccountUrl } from 'utils/terrascope';

export interface FinderAddressLinkProps {
  chainID: string;
  address: string;
  shortenAddress?: boolean;
}

export function FinderAddressLink({
  chainID,
  address,
  shortenAddress,
}: FinderAddressLinkProps) {
  return (
    <a href={getAccountUrl(chainID, address)} target="_blank" rel="noreferrer">
      {shortenAddress ? truncate(address) : address}
    </a>
  );
}
