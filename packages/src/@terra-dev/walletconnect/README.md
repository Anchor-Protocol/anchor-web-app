# `@terra-dev/walletconnect`

## API

<!-- source types.ts -->

[types.ts](types.ts)

```ts
// 대기중 -> 접속됨     -> 접속 종료됨
//      -> 접속 거부됨 ->
// 접속됨
import { IClientMeta } from '@walletconnect/types';

// ---------------------------------------------
// session
// ---------------------------------------------
export enum SessionStatus {
  REQUESTED = 'REQUESTED',
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
}

export interface SessionRequested {
  status: SessionStatus.REQUESTED;
}

export interface SessionConnected {
  status: SessionStatus.CONNECTED;
  chainId: number;
  terraAddress: string;
  peerMeta: IClientMeta;
}

export interface SessionDisconnected {
  status: SessionStatus.DISCONNECTED;
}

export type Session = SessionRequested | SessionConnected | SessionDisconnected;

// ---------------------------------------------
// tx
// ---------------------------------------------
export interface WalletConnectTxResult {
  height: number;
  raw_log: string;
  txhash: string;
}
```

<!-- /source -->

<!-- source connect.ts --pick "WalletConnectControllerOptions WalletConnectController connectWalletIfSessionExists connectWallet" -->

[connect.ts](connect.ts)

````ts
export function connectWalletIfSessionExists(
  options: WalletConnectControllerOptions = {},
): WalletConnectController | null {}

export function connectWallet(
  options: WalletConnectControllerOptions = {},
): WalletConnectController {}

export interface WalletConnectControllerOptions {
  /**
   * Configuration parameter of `new WalletConnect(connectorOpts)`
   *
   * @default
   * ```js
   * {
   *   bridge: 'https://bridge.walletconnect.org',
   *   qrcodeModal: new TerraWalletconnectQrcodeModal(),
   * }
   * ```
   */
  connectorOpts?: IWalletConnectOptions;
  /**
   * Configuration parameter of `new WalletConnect(_, pushServerOpts)`
   *
   * @default undefined
   */
  pushServerOpts?: IPushServerOptions;
}

export interface WalletConnectController {
  session: () => Observable<Session>;
  getLatestSession: () => Session;
  post: (tx: CreateTxOptions) => Promise<WalletConnectTxResult>;
  disconnect: () => void;
}
````

<!-- /source -->

## Usage

Connect

```js
import {
  connectWallet,
  connectWalletIfSessionExists,
  WalletConnectController,
} from '@terra-money/terra-walletconnect';

// restore the session if the session is exists in the localStorage (e.g. browser reload...)
const controller: WalletConnectController | null = connectWalletIfSessionExists();

if (!controller) {
  // connect with interaction
  document.querySelector('button').addEventListener('click', () => {
    const controller: WalletConnectController = connectWallet();
  });
}
```

Functions

```js
import {
  connectWallet,
  Session,
  WalletConnectController,
} from '@terra-money/terra-walletconnect';

const controller: WalletConnectController = connectWallet();

// watch session status
controller.session().subscribe((session: Session) => {
  // the session is one of SessionRequested | SessionConnected | SessionDisconnected
});

// get latest session status
controller.getLatestSession();

// transaction
const {
  txhash,
  height,
} = await controller.post(/* CreateTxOptions of terra.js */);

// disconnect session
controller.disconnect();
```
