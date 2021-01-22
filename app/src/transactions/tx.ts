import { Ratio, uUST } from '@anchor-protocol/notation';

export interface StringifiedTxResult {
  fee: string;
  gasAdjustment: string;
  id: number;
  msgs: string[];
  origin: string;
  purgeQueue: boolean;
  result: {
    height: number;
    raw_log: string;
    txhash: string;
  };
  success: boolean;
}

export interface TxResult {
  fee: {
    // FIXME currently txfee is only uusd
    amount: [
      {
        amount: uUST<string>;
        denom: 'uusd';
      },
    ];
    gas: uUST<string>;
  };
  gasAdjustment: Ratio<string>;
  id: number;
  msgs: {
    type: string;
    value: unknown;
  }[];
  origin: string;
  purgeQueue: boolean;
  result: {
    height: number;
    raw_log: string;
    txhash: string;
  };
  success: boolean;
}

export function parseResult({
  fee,
  gasAdjustment,
  id,
  msgs,
  origin,
  purgeQueue,
  result,
  success,
}: StringifiedTxResult): TxResult {
  return {
    fee: JSON.parse(fee),
    gasAdjustment: gasAdjustment as Ratio,
    id,
    msgs: msgs.map((msg) => JSON.parse(msg)),
    origin,
    purgeQueue,
    result,
    success,
  };
}
