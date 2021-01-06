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

type Initializing = { status: 'initializing' };
type NotInstalled = { status: 'not_installed' };
type NotConnected = { status: 'not_connected'; network: StationNetworkInfo };
type Ready = {
  status: 'ready';
  network: StationNetworkInfo;
  walletAddress: string;
};

export type WalletStatus = Initializing | NotInstalled | NotConnected | Ready;

export function isConnected(
  status: WalletStatus,
): status is NotConnected | Ready {
  return status.status === 'not_connected' || status.status === 'ready';
}
