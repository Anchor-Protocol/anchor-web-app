import { truncate } from '@libs/formatter';
import React from 'react';

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
    <a
      href={`https://finder.terra.money/${chainID}/address/${address}`}
      target="_blank"
      rel="noreferrer"
    >
      {shortenAddress ? truncate(address) : address}
    </a>
  );
}
