import { createQueryFn } from '@libs/react-query-utils';
import { CW20Icons, cw20IconsQuery, TERRA_QUERY_KEY } from '@libs/webapp-fns';
import { useQuery, UseQueryResult } from 'react-query';
import { useTerraWebapp } from '../../contexts/context';

const queryFn = createQueryFn(cw20IconsQuery);

export function useCW20IconsQuery(): UseQueryResult<CW20Icons> {
  const { queryErrorReporter } = useTerraWebapp();

  const result = useQuery([TERRA_QUERY_KEY.CW20_ICONS], queryFn, {
    keepPreviousData: true,
    onError: queryErrorReporter,
  });

  return result;
}
