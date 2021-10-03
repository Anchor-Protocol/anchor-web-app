import {
  MarketDepositAndBorrowData,
  marketDepositAndBorrowQuery,
} from '@anchor-protocol/webapp-fns';
import { useAnchorWebapp } from '@anchor-protocol/webapp-provider';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn((endpoint: string) => {
  return marketDepositAndBorrowQuery({ endpoint });
});

export function useMarketDepositAndBorrowQuery(): UseQueryResult<
  MarketDepositAndBorrowData | undefined
> {
  const { queryErrorReporter, indexerApiEndpoint } = useAnchorWebapp();

  const result = useQuery(
    [ANCHOR_QUERY_KEY.MARKET_DEPOSIT_AND_BORROW, indexerApiEndpoint],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result;
}
