import { useSubscription } from '@anchor-protocol/broadcastable-operation';
import { DateTime, uaUST, uUST } from '@anchor-protocol/notation';
import { createMap, Mapped, useMap } from '@anchor-protocol/use-map';
import { gql, useQuery } from '@apollo/client';
import { useService } from 'contexts/service';
import { MappedQueryResult } from 'queries/types';
import { useQueryErrorAlert } from 'queries/useQueryErrorAlert';
import { useRefetch } from 'queries/useRefetch';
import { useMemo } from 'react';

export interface RawData {
  transactionHistory: {
    Address: string;
    Contract: string;
    Height: number;
    InAmount: uUST<string>;
    InDenom: string;
    OutAmount: uaUST<string>;
    OutDenom: string;
    Timestamp: DateTime;
    TransactionType: string;
    TxHash: string;
  }[];
}

export type Data = RawData;

export const dataMap = createMap<RawData, Data>({
  transactionHistory: (_, { transactionHistory }) => {
    return transactionHistory;
  },
});

export const mockupData: Mapped<RawData, Data> = {
  __data: {
    transactionHistory: [],
  },
  transactionHistory: [],
};

export interface RawVariables {
  walletAddress: string;
}

export type Variables = RawVariables;

export function mapVariables(variables: Variables): RawVariables {
  return variables;
}

export const query = gql`
  query __transactionHistory($walletAddress: String!) {
    transactionHistory: TransactionHistory(
      Address: $walletAddress
      Order: DESC
    ) {
      Address
      Contract
      InAmount
      InDenom
      OutAmount
      OutDenom
      Timestamp
      TransactionType
      TxHash
      Height
    }
  }
`;

export function useTransactionHistory(): MappedQueryResult<
  RawVariables,
  RawData,
  Data
> {
  const { serviceAvailable, walletReady } = useService();

  const variables = useMemo(() => {
    return mapVariables({
      walletAddress: walletReady?.walletAddress ?? '',
    });
  }, [walletReady?.walletAddress]);

  const { data: _data, refetch: _refetch, error, ...result } = useQuery<
    RawData,
    RawVariables
  >(query, {
    skip: !serviceAvailable,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    variables,
  });

  useQueryErrorAlert(error);

  useSubscription((id, event) => {
    if (event === 'done') {
      _refetch();
    }
  });

  const data = useMap(_data, dataMap);
  const refetch = useRefetch(_refetch, dataMap);

  return {
    ...result,
    data: serviceAvailable ? data : mockupData,
    refetch,
  };
}
