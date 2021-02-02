import {
  Fault as FaultResult,
  OperationTimeoutError,
} from '@anchor-protocol/broadcastable-operation';
import { HorizontalHeavyRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalHeavyRuler';
import { Tooltip } from '@anchor-protocol/neumorphism-ui/components/Tooltip';
import { UserDeniedError } from '@anchor-protocol/wallet-provider';
import { IconButton } from '@material-ui/core';
import { Close, FileCopy } from '@material-ui/icons';
import { TxFailedError } from 'errors/TxFailedError';
import { TxInfoError } from 'errors/TxInfoError';
import { TxInfoParseError } from 'errors/TxInfoParseError';
import React from 'react';
import useClipboard from 'react-use-clipboard';
import styled from 'styled-components';

export interface FaultProps {
  result: FaultResult<unknown[]>;
}

export function Fault({ result: { error } }: FaultProps) {
  return (
    <article>
      <figure data-state="fault">
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
            <HorizontalHeavyRuler />
            <ErrorView text={error.toString()} />
          </>
        ) : // getTxInfo
        error instanceof TxInfoError ? (
          <>
            <h2>Tx Failed</h2>
            <HorizontalHeavyRuler />
            <ErrorView text={error.toString()} />
          </>
        ) : error instanceof TxInfoParseError ? (
          <>
            <h2>Parse TxInfo Failed</h2>
            <HorizontalHeavyRuler />
            <ErrorView text={error.toString()} />
          </>
        ) : (
          // uncaught errors...
          <>
            <h2>Failure</h2>
            <HorizontalHeavyRuler />
            <ErrorView text={String(error)} />
          </>
        )
      }
    </article>
  );
}

function ErrorViewBase({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [, setClipboard] = useClipboard(text);

  return (
    <div className={className}>
      <pre>{text}</pre>
      <Tooltip title="Copy Error Message" placement="top">
        <IconButton size="small" onClick={setClipboard}>
          <FileCopy />
        </IconButton>
      </Tooltip>
    </div>
  );
}

const ErrorView = styled(ErrorViewBase)`
  font-size: 12px;

  pre {
    max-height: 400px;
    overflow-y: auto;
    word-break: break-all;
    white-space: break-spaces;
  }

  position: relative;

  button {
    position: absolute;
    right: 0;
    top: -8px;

    svg {
      font-size: 1.2em;
    }
  }
`;
