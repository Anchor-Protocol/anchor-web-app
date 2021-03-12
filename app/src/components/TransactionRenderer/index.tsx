import { OperationResult } from '@terra-dev/broadcastable-operation';
import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { Done } from 'components/TransactionRenderer/Done';
import { Fault } from 'components/TransactionRenderer/Fault';
import { WaitingReceipt } from 'components/TransactionRenderer/WaitingReceipt';
import { WaitingTransaction } from 'components/TransactionRenderer/WaitingTransaction';
import { TransactionResult } from '@anchor-protocol/web-contexts/models/transaction';
import React from 'react';
import styled from 'styled-components';
import { findTxResult } from '@anchor-protocol/web-contexts/transactions/tx';

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
          <SubmitButton
            onClick={() => {
              result.abort();
              onExit && onExit();
            }}
          >
            Stop
          </SubmitButton>
        </Layout>
      );
    case 'fault':
      return (
        <Layout>
          <Fault result={result} />
          <SubmitButton
            onClick={() => {
              result.reset();
              onExit && onExit();
            }}
          >
            OK
          </SubmitButton>
        </Layout>
      );
    case 'done':
      return (
        <Layout>
          <Done result={result} />
          <SubmitButton
            onClick={() => {
              result.reset();
              onExit && onExit();
            }}
          >
            OK
          </SubmitButton>
        </Layout>
      );
    default:
      return null;
  }
}

const SubmitButton = styled(ActionButton)`
  height: 4.1em;
  width: 100%;
`;

const Layout = styled.section`
  > article {
    > figure:first-child {
      color: ${({ theme }) => theme.textColor};

      margin: 0 auto;
      width: 6em;
      height: 6em;
      border-radius: 50%;
      border: 3px solid currentColor;
      display: grid;
      place-content: center;

      svg {
        font-size: 3em;
      }

      &[data-state='fault'] {
        color: ${({ theme }) => theme.colors.negative};
      }

      &[data-state='done'] {
        color: ${({ theme }) => theme.colors.positive};
      }

      &[data-state='in-progress'] {
        border: none;
        transform: scale(1.3);
      }
    }

    > h2 {
      font-weight: 500;
      font-size: 1.3em;
      text-align: center;
      margin-top: 1em;
      margin-bottom: 2em;
    }

    > hr {
      margin-bottom: 2em;
    }
  }

  > button:last-child {
    margin-top: 3em;
  }
`;
