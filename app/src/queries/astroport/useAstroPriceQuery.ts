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

interface AstroPriceWasmQuery {
  astroPrice: WasmQuery<
    astroport.QueryMsg.Pool,
    astroport.QueryMsg.PoolResponse
  >;
}

const astroPriceQuery = async (
  astroUstPairAddress: HumanAddr,
  queryClient: QueryClient,
): Promise<UST> => {
  const {
    astroPrice: {
      assets: [astroShare, ustShare],
    },
  } = await wasmFetch<AstroPriceWasmQuery>({
    ...queryClient,
    id: 'astro--price',
    wasmQuery: {
      astroPrice: {
        contractAddress: astroUstPairAddress,
        query: {
          pool: {},
        },
      },
    },
  });

  const astroPoolSize = astroShare.amount;
  const ustPoolSize = ustShare.amount;

  const astroPrice = big(ustPoolSize)
    .div(+astroPoolSize === 0 ? '1' : astroPoolSize)
    .toString() as UST;

  return astroPrice;
};

const queryFn = createQueryFn(astroPriceQuery);

export function useAstroPriceQuery(): UseQueryResult<number | undefined> {
  const { queryClient, contractAddress, queryErrorReporter } =
    useAnchorWebapp();

  return useQuery(
    [
      ANCHOR_QUERY_KEY.ASTRO_PRICE,
      contractAddress.astroport.astroUstPair,
      queryClient,
    ],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );
}
