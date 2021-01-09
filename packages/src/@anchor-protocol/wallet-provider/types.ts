/**
 * Result of `Extension.info()` of `terra.js`
 */
export interface StationNetworkInfo {
  name: string;
  chainId: string;
  lcd: string;
  fcd: string;
  /** WebSocket Address */
  ws: string;
}

export type WalletInitializing = { status: 'initializing' };
export type WalletNotInstalled = { status: 'not_installed' };
export type WaletNotConnected = {
  status: 'not_connected';
  network: StationNetworkInfo;
};
export type WalletReady = {
  status: 'ready';
  network: StationNetworkInfo;
  walletAddress: string;
};

export type WalletStatus =
  | WalletInitializing
  | WalletNotInstalled
  | WaletNotConnected
  | WalletReady;

export function isConnected(
  status: WalletStatus,
): status is WaletNotConnected | WalletReady {
  return status.status === 'not_connected' || status.status === 'ready';
}
