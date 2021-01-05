import { gql } from '@apollo/client';

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
  RawLog: {
    msg_index: number;
    log: string;
    events: {
      type: string;
      attributes: {
        key: string;
        value: string;
      }[];
    }[];
  }[];
}[];

export function parseData({ TxInfos }: StringifiedData): Data {
  return TxInfos.map(({ TxHash, Success, RawLog }) => ({
    TxHash,
    Success,
    RawLog: JSON.parse(RawLog),
  }));
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
