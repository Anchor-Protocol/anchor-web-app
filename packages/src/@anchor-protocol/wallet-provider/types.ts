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

export enum WalletStatusType {
  /**
   * wallet provider in initialize
   */
  INITIALIZING = 'initializing',

  /**
   * browser is not a chrome
   */
  UNAVAILABLE = 'unavailable',

  /**
   * chrome extension is not installed
   */
  NOT_INSTALLED = 'not_installed',

  /**
   * chrome extension is not connected
   */
  NOT_CONNECTED = 'not_connected',

  /**
   * user can try transaction
   */
  CONNECTED = 'connected',

  /**
   * the wallet address manual provided
   * but, user can't try transaction (the wallet only using for querying)
   */
  MANUAL_PROVIDED = 'manual_provided',
}

export type WalletNotReady = {
  status:
    | WalletStatusType.INITIALIZING
    | WalletStatusType.UNAVAILABLE
    | WalletStatusType.NOT_INSTALLED
    | WalletStatusType.NOT_CONNECTED;
  network: StationNetworkInfo;
};

export type WalletReady = {
  status: WalletStatusType.CONNECTED | WalletStatusType.MANUAL_PROVIDED;
  network: StationNetworkInfo;
  walletAddress: HumanAddr;
};

export type WalletStatus = WalletNotReady | WalletReady;
