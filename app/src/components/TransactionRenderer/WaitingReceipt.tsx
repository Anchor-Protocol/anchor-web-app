import { InProgress } from '@anchor-protocol/broadcastable-operation';
import { truncate } from '@anchor-protocol/notation';
import React from 'react';
import { TxResult } from 'transactions/tx';

export interface WaitingReceiptProps {
  result: InProgress<unknown[]>;
  txResult: TxResult;
}

export function WaitingReceipt({ txResult }: WaitingReceiptProps) {
  return (
    <section>
      <h2>Waiting for receipt...</h2>
      <ul>
        <li>Tx Hash: {truncate(txResult.result.txhash)}</li>
      </ul>
    </section>
  );
}
