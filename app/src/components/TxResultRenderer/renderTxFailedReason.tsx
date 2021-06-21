import {
  CreateTxFailed,
  Timeout,
  TxFailed,
  TxUnspecifiedError,
  UserDenied,
} from '@terra-money/wallet-provider';
import { TxErrorRendering } from '@terra-money/webapp-fns';
import React, { ReactNode } from 'react';

// ----------------------------------------------------------------
// parse error
// ----------------------------------------------------------------
const channels = (
  <ul>
    <li>
      Discord :{' '}
      <a href="https://discord.gg/3gaVztyuT2" target="_blank" rel="noreferrer">
        https://discord.gg/3gaVztyuT2
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
      If the problem still persists, please report your error ID to an admin
      through any of the following channels.
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
      If the problem still persists, please report your error ID to an admin
      through any of the following channels.
    </p>

    {channels}
  </div>
);

const uncaughtErrorMessage = (message: string | null | undefined) => (
  <div style={{ lineHeight: '1.8em' }}>
    {typeof message === 'string' && <p>{message}</p>}
    <p style={{ opacity: typeof message === 'string' ? 0.7 : undefined }}>
      Please report your error ID to an admin through anyone of the following
      channels.
    </p>

    {channels}
  </div>
);

function instanceofWithName<E>(error: unknown, name: string): error is E {
  return error instanceof Error && error.name === name;
}

export function renderTxFailedReason({
  error,
  errorId,
}: TxErrorRendering): ReactNode {
  // @terra-money/wallet-provider
  if (
    error instanceof UserDenied ||
    instanceofWithName<UserDenied>(error, 'UserDenied')
  ) {
    return <h2>User Denied</h2>;
  } else if (
    error instanceof CreateTxFailed ||
    instanceofWithName<CreateTxFailed>(error, 'CreateTxFailed')
  ) {
    return (
      <>
        <h2>Failed to broadcast transaction</h2>
        <ErrorMessageView error={error} errorId={errorId}>
          {createTxFailedMessage(error.message)}
        </ErrorMessageView>
      </>
    );
  } else if (
    error instanceof TxFailed ||
    instanceofWithName<TxFailed>(error, 'TxFailed')
  ) {
    return (
      <>
        <h2>Transaction failed</h2>
        <ErrorMessageView error={null}>
          <div style={{ lineHeight: '1.8em' }}>
            <p style={{ opacity: 0.7 }}>
              The transaction requested has failed due to the following reason:
            </p>
            <p>
              {error.message
                .replace('execute wasm contract failed:', '')
                .replace('failed to execute message; message index: 0', '')
                .replace(': failed to execute message; message index: 0', '')
                .trim()}
            </p>
            <p style={{ opacity: 0.7, marginTop: '1em' }}>
              For assistance, please report your Tx hash to an admin through the
              Anchor Discord server under SUPPORT - #🆔│error-support.
            </p>
            <p>
              Anchor Discord Server:{' '}
              <a
                href="https://discord.gg/3gaVztyuT2"
                target="_blank"
                rel="noreferrer"
              >
                https://discord.gg/3gaVztyuT2
              </a>
            </p>
            <p style={{ opacity: 0.7, marginTop: '1em' }}>
              Alternative lines of communication
            </p>
            <p>
              Telegram Channel:{' '}
              <a
                href="https://t.me/anchor_official"
                target="_blank"
                rel="noreferrer"
              >
                https://t.me/anchor_official
              </a>
            </p>
            <p>
              Github Issues:{' '}
              <a
                href="https://github.com/Anchor-Protocol/anchor-web-app/issues"
                target="_blank"
                rel="noreferrer"
              >
                https://github.com/Anchor-Protocol/anchor-web-app
              </a>
            </p>
          </div>
        </ErrorMessageView>
      </>
    );
  } else if (
    error instanceof Timeout ||
    instanceofWithName<Timeout>(error, 'Timeout')
  ) {
    return (
      <>
        <h2>Timeout</h2>
        <div>{error.message}</div>
      </>
    );
  } else if (
    error instanceof TxUnspecifiedError ||
    instanceofWithName<TxUnspecifiedError>(error, 'TxUnspecifiedError')
  ) {
    return (
      <>
        <h2>Transaction failed</h2>
        <ErrorMessageView error={error} errorId={errorId}>
          {txUnspecifiedErrorMessage(error.message)}
        </ErrorMessageView>
      </>
    );
  } else {
    return (
      <>
        <h2>Oops, something went wrong!</h2>
        <ErrorMessageView error={error} errorId={errorId}>
          {uncaughtErrorMessage(
            error instanceof Error ? error.message : String(error),
          )}
        </ErrorMessageView>
      </>
    );
  }
}

function ErrorMessageView({
  children,
  error,
  errorId,
}: {
  children: ReactNode;
  error: unknown;
  errorId?: string | null;
}) {
  return (
    <div>
      {error instanceof Error && error.message.length > 0 ? (
        <div style={{ lineHeight: '1.8em' }}>{error.message}</div>
      ) : (
        children
      )}
      {!(error instanceof Error && error.message.length > 0) && errorId && (
        <p>
          <b>Error ID</b>: {errorId}
        </p>
      )}
    </div>
  );
}
