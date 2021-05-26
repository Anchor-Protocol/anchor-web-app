import { ApolloClient, ApolloQueryResult, gql } from '@apollo/client';

/** @deprecated use @terra-money/webapp-provider */
export interface RawData {
  TxInfos: {
    TxHash: string;
    Success: boolean;
    RawLog: string;
  }[];
}

/** @deprecated use @terra-money/webapp-provider */
export type RawLogAttribute = {
  key: string;
  value: string;
};

/** @deprecated use @terra-money/webapp-provider */
export type RawLogEvent = {
  type: string;
  attributes: RawLogAttribute[];
};

/** @deprecated use @terra-money/webapp-provider */
export type RawLogMsg = {
  msg_index: number;
  log: string;
  events: RawLogEvent[];
};

/** @deprecated use @terra-money/webapp-provider */
export type Data = {
  TxHash: string;
  Success: boolean;
  RawLog: RawLogMsg[] | string;
}[];

/** @deprecated use @terra-money/webapp-provider */
export function mapData({ TxInfos }: RawData): Data {
  console.log('txInfos.ts..mapData()', TxInfos);
  return TxInfos.map(({ TxHash, Success, RawLog }) => {
    let rawLog: Data[number]['RawLog'] | string;

    try {
      rawLog = JSON.parse(RawLog);
    } catch {
      rawLog = RawLog;
    }

    return {
      TxHash,
      Success,
      RawLog: rawLog,
    };
  });
}

/** @deprecated use @terra-money/webapp-provider */
export interface RawVariables {
  txHash: string;
}

/** @deprecated use @terra-money/webapp-provider */
export type Variables = RawVariables;

/** @deprecated use @terra-money/webapp-provider */
export function mapVariables(variables: Variables): RawVariables {
  return variables;
}

/** @deprecated use @terra-money/webapp-provider */
export const query = gql`
  query __txInfos($txHash: String!) {
    TxInfos(TxHash: $txHash) {
      TxHash
      Success
      RawLog
    }
  }
`;

/** @deprecated use @terra-money/webapp-provider */
export function queryTxInfo(
  client: ApolloClient<any>,
  txHash: string,
): Promise<Omit<ApolloQueryResult<RawData>, 'data'> & { data: Data }> {
  return client
    .query<RawData, RawVariables>({
      query,
      fetchPolicy: 'no-cache',
      variables: mapVariables({
        txHash,
      }),
    })
    .then((result) => {
      return {
        ...result,
        data: result.data ? mapData(result.data) : [],
      };
    });
}

/** @deprecated use @terra-money/webapp-provider */
export function pickRawLog(txInfo: Data, index: number): RawLogMsg | undefined {
  return Array.isArray(txInfo[0].RawLog) ? txInfo[0].RawLog[index] : undefined;
}

/** @deprecated use @terra-money/webapp-provider */
export function pickEvent(
  rawLog: RawLogMsg,
  type: string,
): RawLogEvent | undefined {
  return rawLog.events.find((event) => event.type === type);
}

/** @deprecated use @terra-money/webapp-provider */
export function pickAttributeValue<T extends string>(
  fromContract: RawLogEvent,
  index: number,
): T | undefined {
  const attr = fromContract.attributes[index];
  return attr ? (attr.value as T) : undefined;
}

/** @deprecated use @terra-money/webapp-provider */
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
