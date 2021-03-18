import { DateTime, Num } from '@anchor-protocol/types';
import { gql, useQuery } from '@apollo/client';
import { createMap, useMap } from '@terra-dev/use-map';
import { MappedQueryResult } from 'base/queries/types';
import { useQueryErrorHandler } from 'base/queries/useQueryErrorHandler';
import { useRefetch } from 'base/queries/useRefetch';

export interface RawData {
  apyLPRewards: Array<{
    APY: Num;
    Height: number;
    Timestamp: DateTime;
  }>;
}

export type Data = RawData;

export const dataMap = createMap<RawData, Data>({
  apyLPRewards: (_, { apyLPRewards }) => {
    return apyLPRewards;
  },
});

export interface RawVariables {}

export const query = gql`
  query __anchorLPRewards {
    apyLPRewards: AnchorLPRewards(Order: DESC, Limit: 1) {
      Height
      Timestamp
      APY
    }
  }
`;

export function useAnchorLPRewards(): MappedQueryResult<
  RawVariables,
  RawData,
  Data
> {
  const onError = useQueryErrorHandler();

  const {
    previousData,
    data: _data = previousData,
    refetch: _refetch,
    error,
    ...result
  } = useQuery<RawData, RawVariables>(query, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    pollInterval: 1000 * 60,
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
