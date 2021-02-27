/**
 * Result of `Extension.info()` of `terra.js`
 */
import type { HumanAddr } from '@anchor-protocol/types/contracts';

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
  walletAddress: HumanAddr;
};

export type WalletStatus = WalletNotReady | WalletReady;
