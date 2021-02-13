import { useSubscription } from '@anchor-protocol/broadcastable-operation';
import { gql, QueryResult, useQuery } from '@apollo/client';
import { useMemo } from 'react';

export interface RawData {
  LastSyncedHeight: number;
}

export type Data = number;

export function mapData({ LastSyncedHeight }: RawData): Data {
  return LastSyncedHeight;
}

export const query = gql`
  query __lastSyncedHeight {
    LastSyncedHeight
  }
`;

export function useLastSyncedHeight(): Omit<QueryResult<RawData>, 'data'> & {
  data: Data | undefined;
} {
  const result = useQuery<RawData>(query, {
    fetchPolicy: 'network-only',
    pollInterval: 1000 * 60,
  });

  useSubscription((id, event) => {
    if (event === 'done') {
      result.refetch();
    }
  });

  const data = useMemo(() => (result.data ? mapData(result.data) : undefined), [
    result.data,
  ]);

  return {
    ...result,
    data,
  };
}
