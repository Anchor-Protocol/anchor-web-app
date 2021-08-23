import { HumanAddr } from '@anchor-protocol/types';
import { AncPriceData, ancPriceQuery } from '@anchor-protocol/webapp-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { MantleFetch, useTerraWebapp } from '@libs/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(
  (
    mantleEndpoint: string,
    mantleFetch: MantleFetch,
    ancUstPairContract: HumanAddr,
  ) => {
    return ancPriceQuery({
      mantleEndpoint,
      mantleFetch,
      wasmQuery: {
        ancPrice: {
          contractAddress: ancUstPairContract,
          query: {
            pool: {},
          },
        },
      },
    });
  },
);

export function useAncPriceQuery(): UseQueryResult<AncPriceData | undefined> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const {
    contractAddress: { terraswap },
  } = useAnchorWebapp();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.ANC_PRICE,
      mantleEndpoint,
      mantleFetch,
      terraswap.ancUstPair,
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
