import { availableConnectTypes } from './constants';

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
