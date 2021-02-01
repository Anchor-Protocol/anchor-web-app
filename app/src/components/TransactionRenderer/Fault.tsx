import {
  Fault as FaultResult,
  OperationTimeoutError,
} from '@anchor-protocol/broadcastable-operation';
import { UserDeniedError } from '@anchor-protocol/wallet-provider';
import { Close } from '@material-ui/icons';
import { TxFailedError } from 'errors/TxFailedError';
import { TxInfoError } from 'errors/TxInfoError';
import { TxInfoParseError } from 'errors/TxInfoParseError';
import React from 'react';
import styled from 'styled-components';

export interface FaultProps {
  result: FaultResult<unknown[]>;
}

export function Fault({ result: { error } }: FaultProps) {
  return (
    <article>
      <figure>
        <Close />
      </figure>

      {
        // timeout(postContractMessage) + post() of <ChromeExtensionWalletProvider>
        error instanceof UserDeniedError ? (
          <>
            <h2>User Denied</h2>
          </>
        ) : error instanceof OperationTimeoutError ? (
          <>
            <h2>Operation Timeout</h2>
          </>
        ) : // parseTxResult
        error instanceof TxFailedError ? (
          <>
            <h2>Transaction Failed</h2>
            <ErrorView>
              <pre>{error.toString()}</pre>
            </ErrorView>
          </>
        ) : // getTxInfo
        error instanceof TxInfoError ? (
          <>
            <h2>Tx Failed</h2>
            <ErrorView>
              <pre>{error.toString()}</pre>
            </ErrorView>
          </>
        ) : error instanceof TxInfoParseError ? (
          <>
            <h2>Parse TxInfo Failed</h2>
            <ErrorView>
              <pre>{error.toString()}</pre>
            </ErrorView>
          </>
        ) : (
          // uncaught errors...
          <>
            <h2>Failure</h2>
            <ErrorView>
              <pre>{String(error)}</pre>
            </ErrorView>
          </>
        )
      }
    </article>
  );
}

const ErrorView = styled.div`
  overflow: auto;
  font-size: 12px;
  max-height: 400px;
`;
