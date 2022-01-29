import {
  BLunaClaimableRewards,
  bLunaClaimableRewardsQuery,
} from '@anchor-protocol/app-fns';
import { EMPTY_QUERY_RESULT } from '@libs/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';
import { useAccount } from 'contexts/account';

const queryFn = createQueryFn(bLunaClaimableRewardsQuery);

export function useBLunaClaimableRewards(): UseQueryResult<
  BLunaClaimableRewards | undefined
> {
  const { terraWalletAddress, connected } = useAccount();

  const { queryClient, queryErrorReporter, contractAddress } =
    useAnchorWebapp();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.BOND_CLAIMABLE_REWARDS,
      terraWalletAddress,
      contractAddress.bluna.reward,
      queryClient,
    ],
    queryFn,
    {
      refetchInterval: connected && 1000 * 60 * 5,
      enabled: connected,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return connected ? result : EMPTY_QUERY_RESULT;
}
