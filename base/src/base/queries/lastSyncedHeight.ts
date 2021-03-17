import {
  ApolloClient,
  ApolloQueryResult,
  gql,
  QueryResult,
  useQuery,
} from '@apollo/client';
import { useSubscription } from '@terra-dev/broadcastable-operation';

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

  return {
    ...result,
    data: result.data?.LastSyncedHeight ?? 0,
  };
}

export function queryLastSyncedHeight(
  client: ApolloClient<any>,
): Promise<Omit<ApolloQueryResult<RawData>, 'data'> & { data: Data }> {
  return client
    .query<RawData>({
      query,
      fetchPolicy: 'network-only',
    })
    .then((result) => {
      return {
        ...result,
        data: result.data.LastSyncedHeight,
      };
    });
}
