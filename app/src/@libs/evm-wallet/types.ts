import { availableConnectTypes } from './constants';

export enum EvmChainId {
  ETHEREUM_MAINNET = 1,
  ETHEREUM_ROPSTEN = 3,
  // AVALANCHE_FUJI_TESTNET = 43143,
  // AVALANCHE_MAINNET = 43144,
}

export type Connection = {
  icon: string;
  name: string;
  type: ConnectType;
};

export type WalletStatus = 'initialization' | 'connected' | 'disconnected';

export type ConnectType = typeof availableConnectTypes[number];
