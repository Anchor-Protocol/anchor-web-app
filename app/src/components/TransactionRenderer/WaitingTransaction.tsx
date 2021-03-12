import { InProgress } from '@terra-dev/broadcastable-operation';
import React from 'react';
import { PushSpinner } from 'react-spinners-kit';
import { useTheme } from 'styled-components';

export interface WaitingTransactionProps {
  result: InProgress<unknown[]>;
}

export function WaitingTransaction({ result }: WaitingTransactionProps) {
  const { dimTextColor } = useTheme();

  return (
    <article>
      <figure data-state="in-progress">
        <PushSpinner color={dimTextColor} />
      </figure>

      <h2>Waiting for Terra Station...</h2>
    </article>
  );
}
