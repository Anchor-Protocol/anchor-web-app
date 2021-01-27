import { OperationResult } from '@anchor-protocol/broadcastable-operation';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { Done } from 'components/TransactionRenderer/Done';
import { Fault } from 'components/TransactionRenderer/Fault';
import { WaitingReceipt } from 'components/TransactionRenderer/WaitingReceipt';
import { WaitingTransaction } from 'components/TransactionRenderer/WaitingTransaction';
import { TransactionResult } from 'models/transaction';
import React from 'react';
import styled from 'styled-components';
import { findTxResult } from 'transactions/tx';

export interface TransactionRendererProps {
  result: OperationResult<TransactionResult, unknown[]>;
  onExit?: () => void;
}

export function renderBroadcastTransaction(
  result: OperationResult<TransactionResult, unknown[]>,
) {
  return <TransactionRenderer result={result} />;
}

export function TransactionRenderer({
  result,
  onExit,
}: TransactionRendererProps) {
  switch (result.status) {
    case 'in-progress':
      const txResult = findTxResult(result.snapshots);

      return txResult ? (
        <Layout>
          <WaitingReceipt result={result} txResult={txResult} />
        </Layout>
      ) : (
        <Layout>
          <WaitingTransaction result={result} />
          <ActionButton
            style={{ width: '100%' }}
            onClick={() => {
              result.abort();
              onExit && onExit();
            }}
          >
            Stop Waiting Terra Station
          </ActionButton>
        </Layout>
      );
    case 'fault':
      return (
        <Layout>
          <Fault result={result} />
          <ActionButton
            style={{ width: '100%' }}
            onClick={() => {
              result.reset();
              onExit && onExit();
            }}
          >
            OK
          </ActionButton>
        </Layout>
      );
    case 'done':
      return (
        <Layout>
          <Done result={result} />
          <ActionButton
            style={{ width: '100%' }}
            onClick={() => {
              result.reset();
              onExit && onExit();
            }}
          >
            OK
          </ActionButton>
        </Layout>
      );
    default:
      return null;
  }
}

const Layout = styled.section`
  > article {
    > figure:first-child {
      margin: 0 auto;
      width: 6em;
      height: 6em;
      border-radius: 50%;
      border: 3px solid ${({ theme }) => theme.textColor};
      display: grid;
      place-content: center;

      svg {
        font-size: 3em;
      }
    }

    > h2 {
      font-weight: 500;
      font-size: 1.3em;
      text-align: center;
      margin-top: 1em;
      margin-bottom: 2em;
    }
  }

  > button:last-child {
    margin-top: 5em;
  }
`;
