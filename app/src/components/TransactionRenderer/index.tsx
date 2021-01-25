import { OperationResult } from '@anchor-protocol/broadcastable-operation';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { Done } from 'components/TransactionRenderer/Done';
import { Fault } from 'components/TransactionRenderer/Fault';
import { WaitingReceipt } from 'components/TransactionRenderer/WaitingReceipt';
import { WaitingTransaction } from 'components/TransactionRenderer/WaitingTransaction';
import { TransactionResult } from 'models/transaction';
import React from 'react';
import { findTxResult } from 'transactions/tx';

export interface TransactionRendererProps {
  result: OperationResult<TransactionResult, unknown[]>;
  onExit?: () => void;
}

export function TransactionRenderer({
  result,
  onExit,
}: TransactionRendererProps) {
  switch (result.status) {
    case 'in-progress':
      const txResult = findTxResult(result.snapshots);

      return txResult ? (
        <div>
          <WaitingReceipt result={result} txResult={txResult} />
        </div>
      ) : (
        <div>
          <WaitingTransaction result={result} />
          <ActionButton
            style={{ width: '100%' }}
            onClick={() => {
              result.abort();
              onExit && onExit();
            }}
          >
            Disconnect with Terra Station (Stop Waiting Terra Station Result)
          </ActionButton>
        </div>
      );
    case 'fault':
      return (
        <div>
          <Fault result={result} />
          <ActionButton
            style={{ width: '100%' }}
            onClick={() => {
              result.reset();
              onExit && onExit();
            }}
          >
            Exit
          </ActionButton>
        </div>
      );
    case 'done':
      return (
        <div>
          <Done result={result} />
          <ActionButton
            style={{ width: '100%' }}
            onClick={() => {
              result.reset();
              onExit && onExit();
            }}
          >
            Exit
          </ActionButton>
        </div>
      );
    default:
      return null;
  }
}
