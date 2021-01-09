import { ApolloClient, ApolloQueryResult, gql } from '@apollo/client';

export interface StringifiedData {
  TxInfos: {
    TxHash: string;
    Success: boolean;
    RawLog: string;
  }[];
}

export type Data = {
  TxHash: string;
  Success: boolean;
  RawLog:
    | {
        msg_index: number;
        log: string;
        events: {
          type: string;
          attributes: {
            key: string;
            value: string;
          }[];
        }[];
      }[]
    | string;
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
): Promise<
  ApolloQueryResult<StringifiedData> & { parsedData: Data }
> {
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
