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
    amount: {
      amount: string;
      denom: string;
    }[];
    gas: string;
  };
  gasAdjustment: string;
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
    gasAdjustment,
    id,
    msgs: msgs.map((msg) => JSON.parse(msg)),
    origin,
    purgeQueue,
    result,
    success,
  };
}
