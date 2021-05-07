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
