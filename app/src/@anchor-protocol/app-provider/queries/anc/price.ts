import { AncPriceData, ancPriceQuery } from '@anchor-protocol/app-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(ancPriceQuery);

export function useAncPriceQuery(): UseQueryResult<AncPriceData | undefined> {
  const { queryClient, contractAddress, queryErrorReporter } =
    useAnchorWebapp();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.ANC_PRICE,
      contractAddress.terraswap.ancUstPair,
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
