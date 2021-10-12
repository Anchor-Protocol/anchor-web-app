import { BorrowMarket, borrowMarketQuery } from '@anchor-protocol/app-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(borrowMarketQuery);

export function useBorrowMarketQuery(): UseQueryResult<
  BorrowMarket | undefined
> {
  const { contractAddress, hiveQueryClient, queryErrorReporter } =
    useAnchorWebapp();

  return useQuery(
    [
      ANCHOR_QUERY_KEY.BORROW_MARKET,
      contractAddress.moneyMarket.market,
      contractAddress.moneyMarket.interestModel,
      contractAddress.moneyMarket.oracle,
      contractAddress.moneyMarket.overseer,
      hiveQueryClient,
    ],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );
}
