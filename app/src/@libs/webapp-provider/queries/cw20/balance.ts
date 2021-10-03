import { createQueryFn } from '@libs/react-query-utils';
import { CW20Addr, HumanAddr, Token } from '@libs/types';
import {
  CW20Balance,
  cw20BalanceQuery,
  TERRA_QUERY_KEY,
} from '@libs/webapp-fns';
import { useQuery, UseQueryResult } from 'react-query';
import { useTerraWebapp } from '../../contexts/context';

const queryFn = createQueryFn(cw20BalanceQuery);

export function useCW20BalanceQuery<T extends Token>(
  tokenAddr: CW20Addr | undefined,
  walletAddr: HumanAddr | undefined,
): UseQueryResult<CW20Balance<T> | undefined> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const result = useQuery(
    [
      TERRA_QUERY_KEY.CW20_BALANCE,
      walletAddr,
      tokenAddr,
      mantleEndpoint,
      mantleFetch,
    ],
    queryFn as any,
    {
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result as UseQueryResult<CW20Balance<T> | undefined>;
}
