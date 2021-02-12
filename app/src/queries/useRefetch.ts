import { map, Map } from '@anchor-protocol/use-map';
import { ApolloQueryResult } from '@apollo/client';
import { MappedApolloQueryResult } from 'queries/types';
import { useCallback } from 'react';

export function useRefetch<RawVariables, RawData, Data>(
  refetch: (
    variables?: Partial<RawVariables>,
  ) => Promise<ApolloQueryResult<RawData>>,
  dataMap: Map<RawData, Data>,
): (
  variables?: Partial<RawVariables>,
) => Promise<MappedApolloQueryResult<RawData, Data>> {
  return useCallback(
    (variables?: Partial<RawVariables>) => {
      return refetch(variables).then((result) => ({
        ...result,
        data: map(result.data, dataMap),
      }));
    },
    [dataMap, refetch],
  );
}
