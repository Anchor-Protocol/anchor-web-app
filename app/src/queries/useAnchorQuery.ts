import { useApp } from '@libs/app-provider';
import {
  useQuery,
  QueryFunction,
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
} from 'react-query';

export const useAnchorQuery = <
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'queryKey' | 'queryFn'
  >,
): UseQueryResult<TData, TError> => {
  const { queryErrorReporter } = useApp();

  return useQuery(queryKey, queryFn, {
    onError: queryErrorReporter,
    ...options,
  });
};
