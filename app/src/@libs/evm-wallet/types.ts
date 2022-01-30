import { availableConnectTypes } from './constants';

export enum ChainId {
  ETHEREUM_MAINNET = 1,
  ETHEREUM_TESTNET = 3,
}

export type Connection = {
  icon: string;
  name: string;
  type: ConnectType;
};

export type WalletStatus = 'initialization' | 'connected' | 'disconnected';

export type ConnectType = typeof availableConnectTypes[number];
