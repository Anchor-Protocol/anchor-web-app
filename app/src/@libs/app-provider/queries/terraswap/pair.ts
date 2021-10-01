import { TerraswapPair, terraswapPairQuery } from '@libs/app-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { terraswap } from '@libs/types';
import { useQuery, UseQueryResult } from 'react-query';
import { useApp } from '../../contexts/app';
import { TERRA_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(terraswapPairQuery);

export function useTerraswapPairQuery(
  assetInfos: [terraswap.AssetInfo, terraswap.AssetInfo],
): UseQueryResult<TerraswapPair | undefined> {
  const { queryClient, queryErrorReporter, contractAddress } = useApp();

  const result = useQuery(
    [
      TERRA_QUERY_KEY.TERRASWAP_PAIR,
      contractAddress.terraswap.factory,
      assetInfos,
      queryClient,
    ],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result;
}
