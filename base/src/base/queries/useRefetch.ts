import { map, Map } from '@terra-dev/use-map';
import { ApolloQueryResult } from '@apollo/client';
import { MappedApolloQueryResult } from '../queries/types';
import { useCallback } from 'react';

// TODO remove after refactoring done
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
