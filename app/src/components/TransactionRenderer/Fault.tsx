import {
  Fault as FaultResult,
  OperationTimeoutError,
} from '@anchor-protocol/broadcastable-operation';
import { UserDeniedError } from '@anchor-protocol/wallet-provider';
import { TxFailedError } from 'errors/TxFailedError';
import { TxInfoError } from 'errors/TxInfoError';
import { TxInfoParseError } from 'errors/TxInfoParseError';
import React from 'react';

export interface FaultProps {
  result: FaultResult<unknown[]>;
}

export function Fault({ result: { error } }: FaultProps) {
  return (
    <div>
      <h2>Failure</h2>

      {
        // timeout(postContractMessage) + post() of <ChromeExtensionWalletProvider>
        error instanceof UserDeniedError ? (
          <div>
            <h3>User Denied</h3>
          </div>
        ) : error instanceof OperationTimeoutError ? (
          <div>
            <h3>Operation Timeout</h3>
          </div>
        ) : // parseTxResult
        error instanceof TxFailedError ? (
          <div>
            <h3>Transaction Failed</h3>
            <pre>{error.toString()}</pre>
          </div>
        ) : // getTxInfo
        error instanceof TxInfoError ? (
          <div>
            <h3>Tx Failed</h3>
            <pre>{error.toString()}</pre>
          </div>
        ) : error instanceof TxInfoParseError ? (
          <div>
            <h3>Parse TxInfo Failed</h3>
            <pre>{error.toString()}</pre>
          </div>
        ) : (
          // uncaught errors...
          <pre>{String(error)}</pre>
        )
      }
    </div>
  );
}
