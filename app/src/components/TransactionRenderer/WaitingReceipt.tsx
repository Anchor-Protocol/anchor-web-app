import { InProgress } from '@anchor-protocol/broadcastable-operation';
import { HorizontalHeavyRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalHeavyRuler';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { TxHashLink } from 'components/TxHashLink';
import React from 'react';
import { GuardSpinner } from 'react-spinners-kit';
import { TxResult } from 'transactions/tx';

export interface WaitingReceiptProps {
  result: InProgress<unknown[]>;
  txResult: TxResult;
}

export function WaitingReceipt({ txResult }: WaitingReceiptProps) {
  return (
    <article>
      <figure data-state="in-progress">
        <GuardSpinner />
      </figure>

      <h2>Waiting for receipt...</h2>

      <HorizontalHeavyRuler />

      <TxFeeList showRuler={false}>
        <TxFeeListItem label="Tx Hash">
          <TxHashLink txHash={txResult.result.txhash} />
        </TxFeeListItem>
      </TxFeeList>
    </article>
  );
}
