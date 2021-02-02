import { Done as DoneResult } from '@anchor-protocol/broadcastable-operation';
import { HorizontalHeavyRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalHeavyRuler';
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
      <figure data-state="done">
        <DoneIcon />
      </figure>

      <h2>Complete!</h2>

      <HorizontalHeavyRuler />

      <TxFeeList showRuler={false}>
        {data.details
          .filter((detail): detail is TransactionDetail => !!detail)
          .map(({ name, value }, i) => (
            <TxFeeListItem key={'detail' + i} label={name}>
              {value}
            </TxFeeListItem>
          ))}
      </TxFeeList>
    </article>
  );
}
