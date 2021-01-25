import { useSubscription } from '@anchor-protocol/broadcastable-operation';
import { gql, QueryResult, useQuery } from '@apollo/client';
import { useMemo } from 'react';

export interface StringifiedData {
  LastSyncedHeight: number;
}

export type Data = number;

export function parseData({ LastSyncedHeight }: StringifiedData): Data {
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

  useSubscription((id, event) => {
    if (event === 'done') {
      result.refetch();
    }
  });

  const parsedData = useMemo(
    () => (result.data ? parseData(result.data) : undefined),
    [result.data],
  );

  return {
    ...result,
    parsedData,
  };
}
