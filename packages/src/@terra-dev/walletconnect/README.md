# `@terra-dev/walletconnect`

## API

<!-- source types.ts -->

[types.ts](types.ts)

```ts
import { IClientMeta } from '@walletconnect/types';

// ---------------------------------------------
// session
// ---------------------------------------------
export enum WalletConnectSessionStatus {
  REQUESTED = 'REQUESTED',
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
}

export interface WalletConnectSessionRequested {
  status: WalletConnectSessionStatus.REQUESTED;
}

export interface WalletConnectSessionConnected {
  status: WalletConnectSessionStatus.CONNECTED;
  chainId: number;
  terraAddress: string;
  peerMeta: IClientMeta;
}

export interface WalletConnectSessionDisconnected {
  status: WalletConnectSessionStatus.DISCONNECTED;
}

export type WalletConnectSession =
  | WalletConnectSessionRequested
  | WalletConnectSessionConnected
  | WalletConnectSessionDisconnected;

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
export interface WalletConnectControllerOptions {
  /**
   * Configuration parameter that `new WalletConnect(connectorOpts)`
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
   * Configuration parameter that `new WalletConnect(_, pushServerOpts)`
   *
   * @default undefined
   */
  pushServerOpts?: IPushServerOptions;
}

export interface WalletConnectController {
  session: () => Observable<WalletConnectSession>;
  getLatestSession: () => WalletConnectSession;
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
