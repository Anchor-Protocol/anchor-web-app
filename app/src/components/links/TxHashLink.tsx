import { useNetwork } from '@anchor-protocol/app-provider';
import { truncate } from '@libs/formatter';
import React from 'react';

export interface TxHashProps {
  txHash: string;
}

export function TxHashLink({ txHash }: TxHashProps) {
  const { network } = useNetwork();

  return (
    <a
      href={`https://finder.terra.money/${network.chainID}/tx/${txHash}`}
      target="_blank"
      rel="noreferrer"
    >
      {truncate(txHash)}
    </a>
  );
}
