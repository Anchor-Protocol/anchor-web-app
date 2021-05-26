export enum WalletStatus {
  INITIALIZING = 'INITIALIZING',
  WALLET_NOT_CONNECTED = 'WALLET_NOT_CONNECTED',
  WALLET_CONNECTED = 'WALLET_CONNECTED',
}

export enum ConnectType {
  /** Terra Station Chrome Extension */
  CHROME_EXTENSION = 'CHROME_EXTENSION',

  /** [Hidden mode]: Next version of the Terra Station Browser Extensions */
  WEBEXTENSION = 'WEBEXTENSION',

  /** Terra Station Mobile */
  WALLETCONNECT = 'WALLETCONNECT',

  /** Read only mode - View an address */
  READONLY = 'READONLY',
}

export interface WalletInfo {
  connectType: ConnectType;
  terraAddress: string;
  design?: string;
}
