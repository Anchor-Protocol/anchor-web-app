import { InProgress } from '@anchor-protocol/broadcastable-operation';
import React from 'react';

export interface WaitingTransactionProps {
  result: InProgress<unknown[]>;
}

export function WaitingTransaction({ result }: WaitingTransactionProps) {
  return (
    <section>
      <h2>Wating for Terra Station...</h2>
    </section>
  );
}
