import { CreateTxOptions } from '@terra-money/terra.js';

export interface NetworkInfo {
  /** Network name (e.g. mainnet) */
  name: string;

  /** chainID (e.g. columbus-4) */
  chainID: string;

  /** lcd endpoint (e.g. https://lcd.terra.dev) */
  lcd: string;
}

export interface TxResult extends CreateTxOptions {
  result: {
    height: number;
    raw_log: string;
    txhash: string;
  };
  success: boolean;
}
