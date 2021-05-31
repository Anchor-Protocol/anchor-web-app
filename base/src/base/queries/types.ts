import { ApolloQueryResult } from '@apollo/client';
import { Mapped } from '@terra-dev/use-map';

export type MappedApolloQueryResult<RawData, Data> = Omit<
  ApolloQueryResult<RawData>,
  'data'
> & { data: Mapped<RawData, Data> };
