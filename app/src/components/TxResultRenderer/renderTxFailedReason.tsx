import { OperationTimeoutError } from '@terra-dev/broadcastable-operation';
import {
  CreateTxFailed,
  Timeout,
  TxFailed,
  TxUnspecifiedError,
  UserDenied,
} from '@terra-dev/wallet-types';
import { TxErrorRendering } from '@terra-money/webapp-fns';
import { TxHashLink } from 'base/components/TxHashLink';
import { TxInfoError } from 'base/errors/TxInfoError';
import { TxInfoParseError } from 'base/errors/TxInfoParseError';
import React, { ReactNode } from 'react';

// ----------------------------------------------------------------
// parse error
// ----------------------------------------------------------------
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

const createTxFailedMessage = (message: string) => (
  <div style={{ lineHeight: '1.8em' }}>
    <p>{message}</p>
    <p style={{ opacity: 0.7 }}>
      If you are using multiple wallets, please retry after refreshing the
      WebApp.
    </p>
    <p style={{ opacity: 0.7 }}>
      If the problem still persists, please report your error ID to admin
      through anyone of the following channels.
    </p>

    {channels}
  </div>
);

const txFailedMessage = (txhash: string | undefined, message: string) => (
  <div style={{ lineHeight: '1.8em' }}>
    {txhash && (
      <p>
        TxHash: <TxHashLink txHash={txhash} />
      </p>
    )}
    <p>{message}</p>
    <p style={{ opacity: 0.7 }}>
      If you are using multiple wallets, please retry after refreshing the
      WebApp.
    </p>
    <p style={{ opacity: 0.7 }}>
      If the problem still persists, please report your error ID to admin
      through anyone of the following channels.
    </p>

    {channels}
  </div>
);

const txUnspecifiedErrorMessage = (message: string | undefined | null) => (
  <div style={{ lineHeight: '1.8em' }}>
    {typeof message === 'string' && <p>{message}</p>}
    <p style={{ opacity: typeof message === 'string' ? 0.7 : undefined }}>
      If you are using multiple wallets, please retry after refreshing the
      WebApp.
    </p>
    <p style={{ opacity: typeof message === 'string' ? 0.7 : undefined }}>
      If the problem still persists, please report your error ID to admin
      through anyone of the following channels.
    </p>

    {channels}
  </div>
);

const txParseFailedMessage = (
  txhash: string,
  message: string | null | undefined,
) => (
  <div style={{ lineHeight: '1.8em' }}>
    {typeof message === 'string' && <p>{message}</p>}
    <p style={{ opacity: typeof message === 'string' ? 0.7 : undefined }}>
      The transaction was broadcasted, but there was an error in parsing the
      results.
    </p>
    <p style={{ opacity: typeof message === 'string' ? 0.7 : undefined }}>
      Please report your error ID to admin through anyone of the following
      channels.
    </p>

    <p>
      <b>Tx hash :</b> <TxHashLink txHash={txhash} />
    </p>

    {channels}
  </div>
);

const uncaughtErrorMessage = (message: string | null | undefined) => (
  <div style={{ lineHeight: '1.8em' }}>
    {typeof message === 'string' && <p>{message}</p>}
    <p style={{ opacity: typeof message === 'string' ? 0.7 : undefined }}>
      Please report your error ID to admin through anyone of the following
      channels.
    </p>

    {channels}
  </div>
);

export function renderTxFailedReason({
  error,
  errorId,
}: TxErrorRendering): ReactNode {
  // @terra-money/wallet-provider
  if (error instanceof UserDenied) {
    return <h2>User Denied</h2>;
  } else if (error instanceof CreateTxFailed) {
    return (
      <>
        <h2>Failed to broadcast transaction</h2>
        <div>
          <pre>{createTxFailedMessage(error.message)}</pre>
          {errorId && (
            <p>
              <b>Error ID</b>: {errorId}
            </p>
          )}
        </div>
        <div style={{ display: 'none' }}>
          <pre>{JSON.stringify(error.tx, null, 2)}</pre>
        </div>
      </>
    );
  } else if (error instanceof TxFailed) {
    return (
      <>
        <h2>Failed to transaction</h2>
        <div>
          <pre>{txFailedMessage(error.txhash, error.message)}</pre>
          {errorId && (
            <p>
              <b>Error ID</b>: {errorId}
            </p>
          )}
        </div>
        <div style={{ display: 'none' }}>
          <pre>{error.raw_message}</pre>
        </div>
      </>
    );
  } else if (error instanceof Timeout) {
    return (
      <>
        <h2>Timeout</h2>
        <div>
          <pre>{error.message}</pre>
        </div>
      </>
    );
  } else if (error instanceof TxUnspecifiedError) {
    return (
      <>
        <h2>Failed to transaction</h2>
        <div>
          <pre>{txUnspecifiedErrorMessage(error.message)}</pre>
          {errorId && (
            <p>
              <b>Error ID</b>: {errorId}
            </p>
          )}
        </div>
        <div style={{ display: 'none' }}>
          <pre>{error.toString()}</pre>
        </div>
      </>
    );
  }
  // legacy errors
  else if (error instanceof OperationTimeoutError) {
    return <h2>Timeout</h2>;
  } else if (error instanceof TxInfoError) {
    return (
      <>
        <h2>Failed to transaction</h2>
        <div>
          <pre>{error.message}</pre>
          {errorId && (
            <p>
              <b>Error ID</b>: {errorId}
            </p>
          )}
        </div>
      </>
    );
  } else if (error instanceof TxInfoParseError) {
    return (
      <>
        <h2>Failed to parse transaction results</h2>
        <div>
          <pre>
            {txParseFailedMessage(error.txResult.result.txhash, error.message)}
          </pre>
          {errorId && (
            <p>
              <b>Error ID</b>: {errorId}
            </p>
          )}
        </div>
        <div style={{ display: 'none' }}>
          <pre>{error.toString()}</pre>
        </div>
      </>
    );
  } else {
    return (
      <>
        <h2>Oops, something went wrong!</h2>
        <div>
          <pre>
            {uncaughtErrorMessage(
              error instanceof Error ? error.message : String(error),
            )}
          </pre>
          {errorId && (
            <p>
              <b>Error ID</b>: {errorId}
            </p>
          )}
        </div>
        <div style={{ display: 'none' }}>
          <pre>{String(error)}</pre>
        </div>
      </>
    );
  }
}
