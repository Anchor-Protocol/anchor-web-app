import { useNetwork } from '@anchor-protocol/app-provider';
import { truncate } from '@libs/formatter';
import React from 'react';
import { getTransactionDetailUrl } from 'utils/terrascope';

export interface TxHashProps {
  txHash: string;
}

export function TxHashLink({ txHash }: TxHashProps) {
  const { network } = useNetwork();

  return (
    <a
      href={getTransactionDetailUrl(network.chainID, txHash)}
      target="_blank"
      rel="noreferrer"
    >
      {truncate(txHash)}
    </a>
  );
}
