import { BorrowBorrower, borrowBorrowerQuery } from '@anchor-protocol/app-fns';
import { EMPTY_QUERY_RESULT } from '@libs/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(borrowBorrowerQuery);

export function useBorrowBorrowerQuery(): UseQueryResult<
  BorrowBorrower | undefined
> {
  const connectedWallet = useConnectedWallet();

  const { queryClient, lastSyncedHeight, queryErrorReporter } =
    useAnchorWebapp();

  const {
    contractAddress: { moneyMarket },
  } = useAnchorWebapp();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.BORROW_BORROWER,
      connectedWallet?.walletAddress,
      lastSyncedHeight,
      moneyMarket.market,
      moneyMarket.overseer,
      queryClient,
    ],
    queryFn,
    {
      refetchInterval: !!connectedWallet && 1000 * 60 * 5,
      enabled: !!connectedWallet,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return connectedWallet ? result : EMPTY_QUERY_RESULT;
}
