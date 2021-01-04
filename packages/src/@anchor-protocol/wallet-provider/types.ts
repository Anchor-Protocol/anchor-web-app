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

export type WalletStatus =
  | { status: 'initializing' }
  | { status: 'not_installed' }
  | { status: 'not_connected'; network: StationNetworkInfo }
  | { status: 'ready'; network: StationNetworkInfo; walletAddress: string };
