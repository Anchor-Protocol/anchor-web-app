import { InProgress } from '@anchor-protocol/broadcastable-operation';
import React from 'react';
import { HourglassEmpty } from '@material-ui/icons';

export interface WaitingTransactionProps {
  result: InProgress<unknown[]>;
}

export function WaitingTransaction({ result }: WaitingTransactionProps) {
  return (
    <article>
      <figure data-state="in-progress">
        <HourglassEmpty />
      </figure>

      <h2>Waiting for Terra Station...</h2>
    </article>
  );
}
