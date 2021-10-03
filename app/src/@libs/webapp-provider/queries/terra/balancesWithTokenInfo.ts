import { createQueryFn } from '@libs/react-query-utils';
import { terraswap } from '@libs/types';
import {
  TERRA_QUERY_KEY,
  TerraBalancesWithTokenInfo,
  terraBalancesWithTokenInfoQuery,
} from '@libs/webapp-fns';
import { useTerraWebapp } from '@libs/webapp-provider';
import { useConnectedWallet } from '@terra-dev/use-wallet';
import { useQuery, UseQueryResult } from 'react-query';

const queryFn = createQueryFn(terraBalancesWithTokenInfoQuery);

export function useTerraBalancesWithTokenInfoQuery(
  assets: terraswap.AssetInfo[],
): UseQueryResult<TerraBalancesWithTokenInfo | undefined> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const connectedWallet = useConnectedWallet();

  const result = useQuery(
    [
      TERRA_QUERY_KEY.TERRA_BALANCES,
      connectedWallet?.walletAddress,
      assets,
      mantleEndpoint,
      mantleFetch,
    ],
    queryFn,
    {
      refetchInterval: !!connectedWallet && 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result;
}
