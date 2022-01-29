import {
  BondBEthClaimableRewards,
  bondBEthClaimableRewardsQuery,
} from '@anchor-protocol/app-fns';
import { EMPTY_QUERY_RESULT } from '@libs/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';
import { useAccount } from 'contexts/account';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(bondBEthClaimableRewardsQuery);

export function useBondBEthClaimableRewards(): UseQueryResult<
  BondBEthClaimableRewards | undefined
> {
  const { connected, terraWalletAddress } = useAccount();

  const { queryClient, contractAddress, queryErrorReporter } =
    useAnchorWebapp();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.BOND_BETH_CLAIMABLE_REWARDS,
      terraWalletAddress,
      contractAddress.beth.reward,
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
