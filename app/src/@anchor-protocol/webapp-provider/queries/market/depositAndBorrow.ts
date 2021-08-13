import {
  MarketDepositAndBorrowData,
  marketDepositAndBorrowQuery,
} from '@anchor-protocol/webapp-fns';
import { useAnchorWebapp } from '@anchor-protocol/webapp-provider';
import { createQueryFn } from '@terra-dev/react-query-utils';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { useTerraWebapp } from '@terra-money/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn((endpoint: string) => {
  return marketDepositAndBorrowQuery({ endpoint });
});

export function useMarketDepositAndBorrowQuery(): UseQueryResult<
  MarketDepositAndBorrowData | undefined
> {
  const { queryErrorReporter } = useTerraWebapp();

  const { indexerApiEndpoint } = useAnchorWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [ANCHOR_QUERY_KEY.MARKET_DEPOSIT_AND_BORROW, indexerApiEndpoint],
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
