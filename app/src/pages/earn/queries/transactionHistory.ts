import { useSubscription } from '@anchor-protocol/broadcastable-operation';
import type { DateTime, uaUST, uUST } from '@anchor-protocol/types';
import { Denom, HumanAddr } from '@anchor-protocol/types/contracts';
import { createMap, Mapped, useMap } from '@anchor-protocol/use-map';
import { gql, useQuery } from '@apollo/client';
import { useService } from 'contexts/service';
import { MappedQueryResult } from 'queries/types';
import { useQueryErrorHandler } from 'queries/useQueryErrorHandler';
import { useRefetch } from 'queries/useRefetch';
import { useMemo } from 'react';

export interface RawData {
  transactionHistory: {
    Address: HumanAddr;
    Contract: string;
    Height: number;
    InAmount: uUST<string>;
    InDenom: Denom;
    OutAmount: uaUST<string>;
    OutDenom: Denom;
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
  walletAddress: HumanAddr;
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
    if (!walletReady) return undefined;

    return mapVariables({
      walletAddress: walletReady.walletAddress,
    });
  }, [walletReady]);

  const onError = useQueryErrorHandler();

  const { data: _data, refetch: _refetch, error, ...result } = useQuery<
    RawData,
    RawVariables
  >(query, {
    skip: !variables || !serviceAvailable,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    variables,
    onError,
  });

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
