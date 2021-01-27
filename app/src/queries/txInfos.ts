import { ApolloClient, ApolloQueryResult, gql } from '@apollo/client';

export interface StringifiedData {
  TxInfos: {
    TxHash: string;
    Success: boolean;
    RawLog: string;
  }[];
}

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

export type Data = {
  TxHash: string;
  Success: boolean;
  RawLog: RawLogMsg[] | string;
}[];

export function parseData({ TxInfos }: StringifiedData): Data {
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

export interface StringifiedVariables {
  txHash: string;
}

export type Variables = StringifiedVariables;

export function stringifyVariables(variables: Variables): StringifiedVariables {
  return variables;
}

export const query = gql`
  query($txHash: String!) {
    TxInfos(TxHash: $txHash) {
      TxHash
      Success
      RawLog
    }
  }
`;

export function queryTxInfo(
  client: ApolloClient<any>,
  txHash: string,
): Promise<ApolloQueryResult<StringifiedData> & { parsedData: Data }> {
  return client
    .query<StringifiedData, StringifiedVariables>({
      query,
      fetchPolicy: 'network-only',
      variables: stringifyVariables({
        txHash,
      }),
    })
    .then((result) => {
      return {
        ...result,
        parsedData: result.data ? parseData(result.data) : [],
      };
    });
}

export function pickRawLog(txInfo: Data, index: number): RawLogMsg | undefined {
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
