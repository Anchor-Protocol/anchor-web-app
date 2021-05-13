import { OperationTimeoutError } from '@terra-dev/broadcastable-operation';
import {
  CreateTxFailed,
  Timeout,
  TxFailed,
  TxUnspecifiedError,
  UserDenied,
} from '@terra-dev/wallet-types';
import { TxHashLink } from 'base/components/TxHashLink';
import { TxInfoError } from 'base/errors/TxInfoError';
import { TxInfoParseError } from 'base/errors/TxInfoParseError';
import React, { ReactNode } from 'react';

export enum TxStreamPhase {
  /** in progress post (wait allow from chrome extension or walletconnect) */
  POST = 'POST',

  /** in progress broadcast (poll txInfo) */
  BROADCAST = 'BROADCAST',

  /** checked txInfo is succeed */
  SUCCEED = 'SUCCEED',

  /** failed POST or BROADCAST */
  FAILED = 'FAILED',
}

export interface TxErrorRendering {
  title: ReactNode;
  contents?: ReactNode;
  details?: ReactNode;
  error: unknown;
}

export interface TxReceipt {
  name: ReactNode;
  value: ReactNode;
}

export interface TxRender<T = unknown> {
  /**
   * @internal
   * pass to next unary function
   * this property not affect to rendering
   */
  value: T;

  phase: TxStreamPhase;

  /**
   * if this is exists,
   * - the tx is failed
   */
  failedReason?: TxErrorRendering;

  /**
   * if this is exists,
   * - the tx is succeed
   * - but, had errors when make receipts
   */
  receiptErrors?: TxErrorRendering[];

  /**
   * tx receipts
   */
  receipts: (TxReceipt | undefined | null | false)[];
}

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

const txUnspecifiedErrorMessage = (
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

export function parseError(error: unknown, errorId?: string): TxErrorRendering {
  // @terra-money/wallet-provider
  if (error instanceof UserDenied) {
    return {
      title: 'User Denied',
      error,
    };
  } else if (error instanceof CreateTxFailed) {
    return {
      title: 'Failed to broadcast transaction',
      contents: (
        <div>
          <pre>{createTxFailedMessage(error.message)}</pre>
          {errorId && (
            <p>
              <b>Error ID</b>: {errorId}
            </p>
          )}
        </div>
      ),
      details: JSON.stringify(error.tx, null, 2),
      error,
    };
  } else if (error instanceof TxFailed) {
    return {
      title: 'Failed to transaction',
      contents: (
        <div>
          <pre>{txFailedMessage(error.txhash, error.message)}</pre>
          {errorId && (
            <p>
              <b>Error ID</b>: {errorId}
            </p>
          )}
        </div>
      ),
      details: error.raw_message,
      error,
    };
  } else if (error instanceof Timeout) {
    return {
      title: 'Timeout',
      contents: (
        <div>
          <pre>{error.message}</pre>
        </div>
      ),
      error,
    };
  } else if (error instanceof TxUnspecifiedError) {
    return {
      title: 'Failed to transaction',
      contents: (
        <div>
          <pre>{txUnspecifiedErrorMessage}</pre>
          {errorId && (
            <p>
              <b>Error ID</b>: {errorId}
            </p>
          )}
        </div>
      ),
      details: error.toString(),
      error,
    };
  }
  // legacy errors
  else if (error instanceof OperationTimeoutError) {
    return {
      title: 'Timeout',
      error,
    };
  } else if (error instanceof TxInfoError) {
    return {
      title: 'Failed to transaction',
      contents: (
        <div>
          <pre>{error.message}</pre>
          {errorId && (
            <p>
              <b>Error ID</b>: {errorId}
            </p>
          )}
        </div>
      ),
      error,
    };
  } else if (error instanceof TxInfoParseError) {
    return {
      title: 'Failed to parse transaction results',
      contents: (
        <div>
          <pre>{txParseFailedMessage(error.txResult.result.txhash)}</pre>
          {errorId && (
            <p>
              <b>Error ID</b>: {errorId}
            </p>
          )}
        </div>
      ),
      details: error.toString(),
      error,
    };
  } else {
    return {
      title: 'Oops, something went wrong!',
      contents: (
        <div>
          <pre>{uncaughtErrorMessage}</pre>
          {errorId && (
            <p>
              <b>Error ID</b>: {errorId}
            </p>
          )}
        </div>
      ),
      details: String(error),
      error,
    };
  }
}
