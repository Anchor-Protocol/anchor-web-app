import { terraTreasuryTaxCapQuery } from '@libs/app-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { NativeDenom, Token, u } from '@libs/types';
import { useQuery, UseQueryResult } from 'react-query';
import { useApp } from '../../contexts/app';
import { TERRA_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(terraTreasuryTaxCapQuery);

export function useTerraTreasuryTaxCapQuery<T extends Token>(
  denom: NativeDenom,
): UseQueryResult<u<T>> {
  const { lcdQueryClient, queryErrorReporter } = useApp();

  const result = useQuery(
    [TERRA_QUERY_KEY.TERRA_TREASURY_TAX_CAP, denom, lcdQueryClient],
    queryFn as any,
    {
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result as UseQueryResult<u<T>>;
}
