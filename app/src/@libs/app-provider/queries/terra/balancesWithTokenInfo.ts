import {
  TerraBalancesWithTokenInfo,
  terraBalancesWithTokenInfoQuery,
} from '@libs/app-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { HumanAddr, terraswap } from '@libs/types';
import { useQuery, UseQueryResult } from 'react-query';
import { useAccount } from 'contexts/account';
import { useApp } from '../../contexts/app';
import { TERRA_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(terraBalancesWithTokenInfoQuery);

export function useTerraBalancesWithTokenInfoQuery(
  assets: terraswap.AssetInfo[],
  walletAddress?: HumanAddr,
): UseQueryResult<TerraBalancesWithTokenInfo | undefined> {
  const { queryClient, queryErrorReporter } = useApp();

  const { connected, terraWalletAddress } = useAccount();

  const result = useQuery(
    [
      TERRA_QUERY_KEY.TERRA_BALANCES_WITH_TOKEN_INFO,
      walletAddress ?? terraWalletAddress,
      assets,
      queryClient,
    ],
    queryFn,
    {
      refetchInterval: connected && 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result;
}
