import {
  RewardsUstBorrowRewards,
  rewardsUstBorrowRewardsQuery,
} from '@anchor-protocol/webapp-fns';
import { EMPTY_QUERY_RESULT } from '@libs/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(rewardsUstBorrowRewardsQuery);

export function useRewardsUstBorrowRewardsQuery(): UseQueryResult<
  RewardsUstBorrowRewards | undefined
> {
  const { queryClient, contractAddress, queryErrorReporter } =
    useAnchorWebapp();

  const connectedWallet = useConnectedWallet();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.REWARDS_UST_BORROW_REWARDS,
      connectedWallet?.walletAddress,
      contractAddress.moneyMarket.market,
      queryClient,
    ],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 1,
      enabled: !!connectedWallet,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return connectedWallet ? result : EMPTY_QUERY_RESULT;
}
