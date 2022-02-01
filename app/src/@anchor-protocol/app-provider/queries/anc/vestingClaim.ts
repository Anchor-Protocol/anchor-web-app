import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';
import { EMPTY_QUERY_RESULT } from '@libs/app-provider';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';
import {
  AncVestingAccount,
  ancVestingAccountQuery,
} from '@anchor-protocol/app-fns/queries/anc/vesting';
import { useConnectedWallet } from '@terra-money/use-wallet';

const queryFn = createQueryFn(ancVestingAccountQuery);

export function useAncVestingAccountQuery(): UseQueryResult<
  AncVestingAccount | undefined
> {
  const { queryClient, contractAddress, queryErrorReporter } =
    useAnchorWebapp();

  const connectedWallet = useConnectedWallet();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.ANC_VESTING_ACCOUNT,
      connectedWallet?.walletAddress ?? undefined,
      contractAddress.anchorToken.vesting,
      queryClient,
    ],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 2,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return connectedWallet?.walletAddress ? result : EMPTY_QUERY_RESULT;
}
