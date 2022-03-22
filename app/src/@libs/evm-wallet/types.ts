import { availableConnectTypes } from './constants';

export enum EvmChainId {
  ETHEREUM = 1,
  ETHEREUM_ROPSTEN = 3,
  AVALANCHE_FUJI_TESTNET = 43113,
  AVALANCHE = 43114,
}

export type Connection = {
  icon: string;
  name: string;
  type: ConnectType;
};

export type WalletStatus = 'initialization' | 'connected' | 'disconnected';

export type ConnectType = typeof availableConnectTypes[number];

export interface ERC20Token {
  address: string;
  decimals: number;
  symbol: string;
  image?: string;
}
