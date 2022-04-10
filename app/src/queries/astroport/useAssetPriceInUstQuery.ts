import {
  ANCHOR_QUERY_KEY,
  useAnchorWebapp,
} from '@anchor-protocol/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import { HumanAddr, UST } from '@libs/types';
import { useQuery, UseQueryResult } from 'react-query';
import { QueryClient, wasmFetch, WasmQuery } from '@libs/query-client';
import { astroport } from '@anchor-protocol/types';
import big from 'big.js';

interface AssetPriceWasmQuery {
  assetPrice: WasmQuery<
    astroport.QueryMsg.Pool,
    astroport.QueryMsg.PoolResponse
  >;
}

const assetPriceQuery = async (
  assetUstPairAddress: HumanAddr,
  queryClient: QueryClient,
): Promise<UST> => {
  const {
    assetPrice: {
      assets: [assetShare, ustShare],
    },
  } = await wasmFetch<AssetPriceWasmQuery>({
    ...queryClient,
    id: 'asset--price',
    wasmQuery: {
      assetPrice: {
        contractAddress: assetUstPairAddress,
        query: {
          pool: {},
        },
      },
    },
  });

  const assetPoolSize = big(assetShare.amount);
  const ustPoolSize = big(ustShare.amount);

  const assetPrice = assetPoolSize.eq(0)
    ? ustPoolSize
    : ustPoolSize.div(assetPoolSize);

  return assetPrice.toString() as UST;
};

const queryFn = createQueryFn(assetPriceQuery);

type AssetWithAstroportPool = 'anc' | 'astro';

export function useAssetPriceInUstQuery(
  asset: AssetWithAstroportPool,
): UseQueryResult<UST> {
  const {
    queryClient,
    contractAddress: {
      astroport: { ancUstPair, astroUstPair },
    },
    queryErrorReporter,
  } = useAnchorWebapp();

  const astroportAddress: Record<AssetWithAstroportPool, HumanAddr> = {
    anc: ancUstPair,
    astro: astroUstPair,
  };

  return useQuery(
    [ANCHOR_QUERY_KEY.ASTRO_PRICE, astroportAddress[asset], queryClient],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );
}
