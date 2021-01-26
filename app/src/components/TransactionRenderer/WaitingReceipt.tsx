import { InProgress } from '@anchor-protocol/broadcastable-operation';
import { truncate } from '@anchor-protocol/notation';
import { HourglassEmpty } from '@material-ui/icons';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import React from 'react';
import { TxResult } from 'transactions/tx';

export interface WaitingReceiptProps {
  result: InProgress<unknown[]>;
  txResult: TxResult;
}

export function WaitingReceipt({ txResult }: WaitingReceiptProps) {
  return (
    <article>
      <figure>
        <HourglassEmpty />
      </figure>

      <h2>Waiting for receipt...</h2>

      <TxFeeList>
        <TxFeeListItem label="Tx Hash">
          {truncate(txResult.result.txhash)}
        </TxFeeListItem>
      </TxFeeList>
    </article>
  );
}
