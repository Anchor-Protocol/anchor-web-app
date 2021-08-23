import { MantleFetch } from '@libs/mantle';
import { Timeout, TxFailed } from '@terra-dev/wallet-types';
import { CreateTxOptions } from '@terra-money/terra.js';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type RawLogAttribute = {
  key: string;
  value: string;
};

export type RawLogEvent = {
  type: string;
  attributes: RawLogAttribute[];
};

export type RawLogMsg = {
  msg_index: number;
  log: string;
  events: RawLogEvent[];
};

interface TxInfoRawData {
  TxInfos: {
    TxHash: string;
    Success: boolean;
    RawLog: string;
  }[];
}

export type TxInfoData = {
  TxHash: string;
  Success: boolean;
  RawLog?: RawLogMsg[] | string;
}[];

export interface TxInfoVariables {
  txhash: string;
}

// language=graphql
export const TX_INFO_QUERY = `
  query ($txhash: String!) {
    TxInfos(TxHash: $txhash) {
      TxHash
      Success
      RawLog
    }
  }
`;

export interface TxInfoQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  variables: TxInfoVariables;
}

export async function txInfoQuery({
  mantleEndpoint,
  mantleFetch,
  variables,
}: TxInfoQueryParams): Promise<TxInfoData> {
  const { TxInfos } = await mantleFetch<TxInfoVariables, TxInfoRawData>(
    TX_INFO_QUERY,
    variables,
    `${mantleEndpoint}?txinfo&txhash=${variables.txhash}`,
  );

  return TxInfos.map(({ TxHash, Success, RawLog: _RawLog }) => {
    let RawLog: TxInfoData[number]['RawLog'] = _RawLog;

    try {
      RawLog = JSON.parse(_RawLog) ?? _RawLog;
    } catch {}

    return {
      TxHash,
      Success,
      RawLog,
    };
  });
}

// ---------------------------------------------
// poll
// ---------------------------------------------
export class TxInfoFailed extends Error {
  constructor(
    public readonly txhash: string,
    public readonly txInfo: TxInfoData,
    message: string,
  ) {
    super(message);
    this.name = 'TxInfoFailed';
  }
}

export type PollTxInfoParams = Omit<TxInfoQueryParams, 'variables'> & {
  tx?: CreateTxOptions;
  txhash: string;
};

export async function pollTxInfo({
  mantleEndpoint,
  mantleFetch,
  tx,
  txhash,
}: PollTxInfoParams): Promise<TxInfoData> {
  const until = Date.now() + 1000 * 20;

  while (true) {
    const txInfo = await txInfoQuery({
      mantleEndpoint,
      mantleFetch,
      variables: { txhash },
    });

    if (txInfo.length > 0) {
      const fail = txInfo.find(({ Success }) => !Success);

      if (fail) {
        console.log('txInfo.ts..pollTxInfo()', fail);
        const message =
          typeof fail.RawLog === 'string'
            ? fail.RawLog
            : Array.isArray(fail.RawLog)
            ? fail.RawLog.map(({ log }) => log).join('\n')
            : `Failed broadcast the "${txhash}"`;

        if (tx) {
          throw new TxFailed(tx, txhash, message, fail.RawLog);
        } else {
          throw new TxInfoFailed(txhash, txInfo, message);
        }
      }

      return txInfo;
    } else if (Date.now() < until) {
      await sleep(500);
    } else {
      throw new Timeout(`Could not get TxInfo for 20 seconds`);
    }
  }
}

// ---------------------------------------------
// utils
// ---------------------------------------------
export function pickRawLog(
  txInfo: TxInfoData,
  index: number,
): RawLogMsg | undefined {
  return Array.isArray(txInfo[0].RawLog) ? txInfo[0].RawLog[index] : undefined;
}

export function pickEvent(
  rawLog: RawLogMsg,
  type: string,
): RawLogEvent | undefined {
  return rawLog.events.find((event) => event.type === type);
}

export function pickAttributeValue<T extends string>(
  fromContract: RawLogEvent,
  index: number,
): T | undefined {
  const attr = fromContract.attributes[index];
  return attr ? (attr.value as T) : undefined;
}

export function pickAttributeValueByKey<T extends string>(
  fromContract: RawLogEvent,
  key: string,
  pick?: (attrs: RawLogAttribute[]) => RawLogAttribute,
): T | undefined {
  const attrs = fromContract.attributes.filter((attr) => key === attr.key);

  if (attrs.length > 1) {
    return (pick?.(attrs) ?? attrs[0])?.value as T | undefined;
  }
  return attrs[0]?.value as T | undefined;
}
