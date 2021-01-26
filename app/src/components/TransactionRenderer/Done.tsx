import { Done as DoneResult } from '@anchor-protocol/broadcastable-operation';
import {
  demicrofy,
  formatUSTWithPostfixUnits,
  truncate,
} from '@anchor-protocol/notation';
import { Done as DoneIcon } from '@material-ui/icons';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { TransactionDetail, TransactionResult } from 'models/transaction';
import React from 'react';

export interface DoneProps {
  result: DoneResult<TransactionResult, unknown[]>;
}

export function Done({ result: { data } }: DoneProps) {
  return (
    <article>
      <figure>
        <DoneIcon />
      </figure>

      <h2>Complete!</h2>

      <TxFeeList>
        {data.details
          .filter((detail): detail is TransactionDetail => !!detail)
          .map(({ name, value }, i) => (
            <TxFeeListItem key={'detail' + i} label={name}>
              {value}
            </TxFeeListItem>
          ))}
        <TxFeeListItem label="Tx Hash">{truncate(data.txHash)}</TxFeeListItem>
        <TxFeeListItem label="Tx Fee">
          {formatUSTWithPostfixUnits(demicrofy(data.txFee))} UST
        </TxFeeListItem>
      </TxFeeList>
    </article>
  );
}
