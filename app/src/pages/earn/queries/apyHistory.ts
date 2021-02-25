import { DateTime, Ratio } from '@anchor-protocol/notation';
import { createMap, useMap } from '@anchor-protocol/use-map';
import { gql, useQuery } from '@apollo/client';
import { useService } from 'contexts/service';
import { MappedQueryResult } from 'queries/types';
import { useQueryErrorHandler } from 'queries/useQueryErrorHandler';
import { useRefetch } from 'queries/useRefetch';
import { useMemo } from 'react';

export interface RawData {
  apyHistory: {
    Timestamp: DateTime;
    Height: number;
    DepositRate: Ratio<string>;
  }[];
}

export type Data = RawData;

export const dataMap = createMap<RawData, Data>({
  apyHistory: (_, { apyHistory }) => {
    return apyHistory;
  },
});

export interface RawVariables {}

export type Variables = RawVariables;

export function mapVariables(variables: Variables): RawVariables {
  return variables;
}

export const query = gql`
  query __apyHistory {
    apyHistory: AnchorDepositRateHistory(Order: DESC, Limit: 10) {
      Timestamp
      Height
      DepositRate
    }
  }
`;

export function useAPYHistory(): MappedQueryResult<
  RawVariables,
  RawData,
  Data
> {
  const { serviceAvailable } = useService();

  const variables = useMemo(() => {
    return mapVariables({});
  }, []);

  const onError = useQueryErrorHandler();

  const { data: _data, refetch: _refetch, error, ...result } = useQuery<
    RawData,
    RawVariables
  >(query, {
    skip: !serviceAvailable,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    //pollInterval: 1000 * 60,
    variables,
    onError,
  });

  const data = useMap(_data, dataMap);
  const refetch = useRefetch(_refetch, dataMap);

  return {
    ...result,
    data,
    refetch,
  };
}
