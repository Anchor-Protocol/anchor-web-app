import { InProgress } from '@terra-dev/broadcastable-operation';
import { HorizontalHeavyRuler } from '@terra-dev/neumorphism-ui/components/HorizontalHeavyRuler';
import { TxFeeList, TxFeeListItem } from 'components/TxFeeList';
import { TxHashLink } from '@anchor-protocol/web-contexts/components/TxHashLink';
import React from 'react';
import { GuardSpinner } from 'react-spinners-kit';
import { TxResult } from '@anchor-protocol/web-contexts/transactions/tx';

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
