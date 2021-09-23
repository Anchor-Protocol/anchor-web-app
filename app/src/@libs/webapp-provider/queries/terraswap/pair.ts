import { createQueryFn } from '@libs/react-query-utils';
import { terraswap } from '@libs/types';
import { useBrowserInactive } from '@libs/use-browser-inactive';
import {
  TERRA_QUERY_KEY,
  TerraswapPair,
  terraswapPairQuery,
} from '@libs/webapp-fns';
import { useTerraWebapp } from '@libs/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';

const queryFn = createQueryFn(terraswapPairQuery);

export function useTerraswapPairQuery(
  assetInfos: [terraswap.AssetInfo, terraswap.AssetInfo],
): UseQueryResult<TerraswapPair | undefined> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter, contractAddress } =
    useTerraWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      TERRA_QUERY_KEY.TERRASWAP_PAIR,
      contractAddress.terraswap.factory,
      assetInfos,
      mantleEndpoint,
      mantleFetch,
    ],
    queryFn,
    {
      refetchInterval: browserInactive && 1000 * 60 * 5,
      enabled: !browserInactive,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result;
}
