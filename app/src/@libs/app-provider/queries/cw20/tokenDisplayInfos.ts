import {
  CW20TokenDisplayInfos,
  cw20TokenDisplayInfosQuery,
} from '@libs/app-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';
import { useApp } from '../../contexts/app';
import { TERRA_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(cw20TokenDisplayInfosQuery);

export function useCW20TokenDisplayInfosQuery(): UseQueryResult<CW20TokenDisplayInfos> {
  const { queryErrorReporter } = useApp();

  const result = useQuery([TERRA_QUERY_KEY.CW20_TOKEN_DISPLAY_INFOS], queryFn, {
    keepPreviousData: true,
    onError: queryErrorReporter,
  });

  return result;
}
