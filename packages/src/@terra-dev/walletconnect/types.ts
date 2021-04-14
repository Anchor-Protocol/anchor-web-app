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
export interface TxResult {
  height: number;
  raw_log: string;
  txhash: string;
}
