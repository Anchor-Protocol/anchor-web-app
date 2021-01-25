import { Done as DoneResult } from '@anchor-protocol/broadcastable-operation';
import {
  demicrofy,
  formatUSTWithPostfixUnits,
  truncate,
} from '@anchor-protocol/notation';
import { TransactionDetail, TransactionResult } from 'models/transaction';
import React from 'react';

export interface DoneProps {
  result: DoneResult<TransactionResult, unknown[]>;
}

export function Done({ result }: DoneProps) {
  return (
    <div>
      <h2>Complete!</h2>
      <ul>
        <li>Tx Hash: {truncate(result.data.txHash)}</li>
        <li>
          Tx Fee: {formatUSTWithPostfixUnits(demicrofy(result.data.txFee))} UST
        </li>
        {result.data.details
          .filter((detail): detail is TransactionDetail => !!detail)
          .map(({ name, value }, i) => (
            <li key={'detail' + i}>
              {name}: {value}
            </li>
          ))}
      </ul>
    </div>
  );
}
