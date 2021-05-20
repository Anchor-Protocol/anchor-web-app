import { DateTime, Rate } from '@anchor-protocol/types';
import { createMap, useMap } from '@terra-dev/use-map';
import { MappedQueryResult } from 'base/queries/types';
import { useQueryErrorHandler } from 'base/queries/useQueryErrorHandler';
import { useRefetch } from 'base/queries/useRefetch';
import { gql, useQuery } from '@apollo/client';

export interface RawData {
  borrowerDistributionAPYs: Array<{
    DistributionAPY: Rate;
    Height: number;
    Timestamp: DateTime;
  }>;

  govRewards: Array<{
    CurrentAPY: Rate;
    Timestamp: DateTime;
    Height: number;
  }>;

  lpRewards: Array<{
    APY: Rate;
    Height: number;
    Timestamp: DateTime;
  }>;
}

export type Data = RawData;

export const dataMap = createMap<RawData, Data>({
  borrowerDistributionAPYs: (_, { borrowerDistributionAPYs }) => {
    return borrowerDistributionAPYs;
  },
  govRewards: (_, { govRewards }) => {
    return govRewards;
  },
  lpRewards: (_, { lpRewards }) => {
    return lpRewards;
  },
});

export const query = gql`
  query __borrowAPY {
    borrowerDistributionAPYs: AnchorBorrowerDistributionAPYs(
      Order: DESC
      Limit: 1
    ) {
      Height
      Timestamp
      DistributionAPY
    }
    govRewards: AnchorGovRewardRecords(Order: DESC, Limit: 1) {
      CurrentAPY
      Timestamp
      Height
    }
    lpRewards: AnchorLPRewards(Order: DESC, Limit: 1) {
      Height
      Timestamp
      APY
    }
  }
`;

export function useBorrowAPY(): MappedQueryResult<{}, RawData, Data> {
  const onError = useQueryErrorHandler();

  const { data: _data, refetch: _refetch, error, ...result } = useQuery<
    RawData,
    {}
  >(query, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    pollInterval: 1000 * 60 * 10,
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
