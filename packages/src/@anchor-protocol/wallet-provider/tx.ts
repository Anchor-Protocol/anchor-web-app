import { CreateTxOptions } from '@terra-money/terra.js';

export interface StringifiedTxResult {
  fee: string;
  gasAdjustment: string;
  id: number;
  msgs: string[];
  result: {
    height: number;
    raw_log: string;
    txhash: string;
  };
  success: boolean;
}

export interface TxResult extends CreateTxOptions {
  result: {
    height: number;
    raw_log: string;
    txhash: string;
  };
  success: boolean;
}

export function findTxResult(values: any[]): TxResult | undefined {
  return values.find((value) => {
    return (
      value &&
      Array.isArray(value.msgs) &&
      'fee' in value &&
      'gasAdjustment' in value &&
      'id' in value &&
      'result' in value &&
      'success' in value
    );
  }) as TxResult | undefined;
}
