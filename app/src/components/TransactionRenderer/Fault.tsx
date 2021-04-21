import {
  TxFailedError,
  UserDeniedError,
} from '@anchor-protocol/wallet-provider';
import { Close } from '@material-ui/icons';
import {
  Fault as FaultResult,
  OperationTimeoutError,
} from '@terra-dev/broadcastable-operation';
import { HorizontalHeavyRuler } from '@terra-dev/neumorphism-ui/components/HorizontalHeavyRuler';
import { TxHashLink } from 'base/components/TxHashLink';
import { TxInfoError } from 'base/errors/TxInfoError';
import { TxInfoParseError } from 'base/errors/TxInfoParseError';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

export interface FaultProps {
  result: FaultResult<unknown[]>;
}

const channels = (
  <ul>
    <li>
      Discord :{' '}
      <a href="https://discord.gg/9aUYgpKZ9c" target="_blank" rel="noreferrer">
        https://discord.gg/9aUYgpKZ9c
      </a>
    </li>
    <li>
      Telegram :{' '}
      <a href="https://t.me/anchor_official" target="_blank" rel="noreferrer">
        https://t.me/anchor_official
      </a>
    </li>
    <li>
      Github Issues :{' '}
      <a
        href="https://github.com/Anchor-Protocol/anchor-web-app/issues"
        target="_blank"
        rel="noreferrer"
      >
        https://github.com/Anchor-Protocol/anchor-web-app
      </a>
    </li>
  </ul>
);

const txFailedMessage = (
  <div style={{ lineHeight: '1.8em' }}>
    <p>
      If you are using multiple wallets, please retry after refreshing the
      WebApp.
    </p>
    <p>
      If the problem still persists, please report your error ID to admin
      through anyone of the following channels.
    </p>

    {channels}
  </div>
);

const txParseFailedMessage = (txhash: string) => (
  <div style={{ lineHeight: '1.8em' }}>
    <p>
      The transaction was broadcasted, but there was an error in parsing the
      results.
    </p>
    <p>
      Please report your error ID to admin through anyone of the following
      channels.
    </p>

    <p>
      <b>Tx hash :</b> <TxHashLink txHash={txhash} />
    </p>

    {channels}
  </div>
);

const uncaughtErrorMessage = (
  <div style={{ lineHeight: '1.8em' }}>
    <p>
      Please report your error ID to admin through anyone of the following
      channels.
    </p>

    {channels}
  </div>
);

export function Fault({ result: { error, errorId } }: FaultProps) {
  return (
    <article>
      <figure data-state="fault">
        <Close />
      </figure>

      {
        // user denied the tx in wallet
        error instanceof UserDeniedError ? (
          <>
            <h2>User Denied</h2>
          </>
        ) : // timeout(postContractMessage) + post() of wallet
        error instanceof OperationTimeoutError ? (
          <>
            <h2>Operation Timeout</h2>
          </>
        ) : // error caused in parseTxResult()
        error instanceof TxFailedError ? (
          <>
            <h2>Failed to broadcast transaction</h2>
            <HorizontalHeavyRuler />
            <ErrorView errorId={errorId} text={txFailedMessage} />
          </>
        ) : // getTxInfo() the tx is failed
        error instanceof TxInfoError ? (
          <>
            <h2>Tx Failed</h2>
            <HorizontalHeavyRuler />
            <ErrorView errorId={errorId} text={error.toString()} />
          </>
        ) : // failed parse the txInfo (front-end error)
        error instanceof TxInfoParseError ? (
          <>
            <h2>Failed to parse transaction results</h2>
            <HorizontalHeavyRuler />
            <ErrorView
              errorId={errorId}
              text={txParseFailedMessage(error.txResult.result.txhash)}
            />
          </>
        ) : (
          // uncaught errors...
          <>
            <h2>Oops, something went wrong!</h2>
            <HorizontalHeavyRuler />
            <ErrorView errorId={errorId} text={uncaughtErrorMessage} />
          </>
        )
      }
    </article>
  );
}

function ErrorViewBase({
  text,
  className,
  errorId,
}: {
  text: ReactNode;
  className?: string;
  errorId?: string | null;
}) {
  return (
    <div className={className}>
      <div>
        {typeof text === 'string' ? <pre>{text}</pre> : text}
        {errorId && (
          <p style={{ marginTop: 20, opacity: 0.5 }}>
            <b>Error ID</b>: {errorId}
          </p>
        )}
      </div>
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
