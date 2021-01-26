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
            <pre>{error.toString()}</pre>
          </>
        ) : // getTxInfo
        error instanceof TxInfoError ? (
          <>
            <h2>Tx Failed</h2>
            <pre>{error.toString()}</pre>
          </>
        ) : error instanceof TxInfoParseError ? (
          <>
            <h2>Parse TxInfo Failed</h2>
            <pre>{error.toString()}</pre>
          </>
        ) : (
          // uncaught errors...
          <>
            <h2>Failure</h2>
            <pre>{String(error)}</pre>
          </>
        )
      }
    </article>
  );
}
