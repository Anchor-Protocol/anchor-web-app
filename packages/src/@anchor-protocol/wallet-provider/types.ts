export interface NetworkInfo {
  name: string;
  chainID: string;
}

export enum WalletStatus {
  INITIALIZING = 'INITIALIZING',
  WALLET_NOT_CONNECTED = 'WALLET_NOT_CONNECTED',
  WALLET_CONNECTED = 'WALLET_CONNECTED',
}

export enum ConnectType {
  CHROME_EXTENSION = 'CHROME_EXTENSION',
  WALLETCONNECT = 'WALLETCONNECT',
  READONLY = 'READONLY',
}

export interface WalletInfo {
  connectType: ConnectType;
  terraAddress: string;
  design?: string;
}
