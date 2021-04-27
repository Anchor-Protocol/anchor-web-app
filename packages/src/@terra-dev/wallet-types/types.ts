import { CreateTxOptions } from '@terra-money/terra.js';

export interface NetworkInfo {
  name: string;
  chainID: string;
}

export interface TxResult extends CreateTxOptions {
  result: {
    height: number;
    raw_log: string;
    txhash: string;
  };
  success: boolean;
}
