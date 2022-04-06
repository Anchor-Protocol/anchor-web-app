export enum ConnectType {
  None = 'None',
  MetaMask = 'MetaMask',
  WalletConnect = 'WalletConnect',
}

export type Connection = {
  icon: string;
  name: string;
  type: ConnectType;
};

export enum WalletStatus {
  Initializing = 'initialization',
  Connected = 'connected',
  Disconnected = 'disconnected',
}

export interface ERC20Token {
  address: string;
  decimals: number;
  symbol: string;
  image?: string;
}
