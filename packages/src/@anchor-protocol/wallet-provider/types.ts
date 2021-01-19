/**
 * Result of `Extension.info()` of `terra.js`
 */
export interface StationNetworkInfo {
  name: string;
  chainID: string;
  lcd: string;
  fcd: string;
  /** WebSocket Address */
  ws: string;
}

export type WalletNotReady = {
  status: 'initializing' | 'unavailable' | 'not_installed' | 'not_connected';
  network: StationNetworkInfo;
};
export type WalletReady = {
  status: 'ready';
  network: StationNetworkInfo;
  walletAddress: string;
};

export type WalletStatus = WalletNotReady | WalletReady;
