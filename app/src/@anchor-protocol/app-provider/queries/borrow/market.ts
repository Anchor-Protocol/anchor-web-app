import { borrowMarketQuery } from '@anchor-protocol/app-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';
import {
  BorrowMarketWithDisplay,
  withBorrowMarketTokenDisplay,
} from './utils/tokenDisplay';
import { useQueryWithTokenDisplay } from '../utils/tokenDisplay';

const queryFn = createQueryFn(borrowMarketQuery);

export function useBorrowMarketQuery(): UseQueryResult<
  BorrowMarketWithDisplay | undefined
> {
  const { contractAddress, hiveQueryClient, queryErrorReporter } =
    useAnchorWebapp();

  const borrowMarket = useQuery(
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
      keepPreviousData: false,
      onError: queryErrorReporter,
    },
  );

  return useQueryWithTokenDisplay(borrowMarket, withBorrowMarketTokenDisplay);
}
