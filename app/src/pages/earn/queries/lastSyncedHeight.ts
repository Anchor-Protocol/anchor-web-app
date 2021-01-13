import { useQuerySubscription } from '@anchor-protocol/use-broadcastable-query';
import { gql, QueryResult, useQuery } from '@apollo/client';
import { useMemo } from 'react';

export interface StringifiedData {
  LastSyncedHeight: number;
}

export type Data = number;

export function parseData({LastSyncedHeight}: StringifiedData): Data {
  return LastSyncedHeight;
}

export const query = gql`
  query lastSyncedHeight {
    LastSyncedHeight
  }
`;

export function useLastSyncedHeight(): QueryResult<StringifiedData> & {
  parsedData: Data | undefined;
} {
  const result = useQuery<StringifiedData>(query, {
    fetchPolicy: 'cache-and-network',
  });

  useQuerySubscription(
    (id, event) => {
      if (event === 'done') {
        result.refetch();
      }
    },
    [result.refetch],
  );

  const parsedData = useMemo(
    () => (result.data ? parseData(result.data) : undefined),
    [result.data],
  );

  return {
    ...result,
    parsedData,
  };
}
