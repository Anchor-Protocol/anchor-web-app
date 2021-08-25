import { AncPriceData, ancPriceQuery } from '@anchor-protocol/webapp-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { useTerraWebapp } from '@libs/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(ancPriceQuery);

export function useAncPriceQuery(): UseQueryResult<AncPriceData | undefined> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const {
    contractAddress: { terraswap },
  } = useAnchorWebapp();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.ANC_PRICE,
      terraswap.ancUstPair,
      mantleEndpoint,
      mantleFetch,
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
