import { Mapped } from '@terra-dev/use-map';
import { ApolloQueryResult, QueryResult } from '@apollo/client';

export type MappedQueryResult<RawVariables, RawData, Data> = Omit<
  QueryResult<RawData, RawVariables>,
  'data' | 'refetch'
> & {
  data: Mapped<RawData, Data>;
  refetch: (
    variables?: Partial<RawVariables>,
  ) => Promise<MappedApolloQueryResult<RawData, Data>>;
};

export type MappedApolloQueryResult<RawData, Data> = Omit<
  ApolloQueryResult<RawData>,
  'data'
> & { data: Mapped<RawData, Data> };
