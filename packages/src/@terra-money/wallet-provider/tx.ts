import { TxResult } from '@terra-dev/wallet-types';

export type { TxResult } from '@terra-dev/wallet-types';

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

export function findTxResult(values: any[]): TxResult | undefined {
  return values.find((value) => {
    return (
      value &&
      Array.isArray(value.msgs) &&
      'fee' in value &&
      'gasAdjustment' in value &&
      'result' in value &&
      'success' in value
    );
  }) as TxResult | undefined;
}
