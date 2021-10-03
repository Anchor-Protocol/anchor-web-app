import { govMyPollsQuery, MyPoll } from '@anchor-protocol/app-fns';
import { createQueryFn } from '@libs/react-query-utils';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(govMyPollsQuery);

export function useGovMyPollsQuery(): UseQueryResult<MyPoll[]> {
  const connectedWallet = useConnectedWallet();

  const { queryClient, contractAddress, queryErrorReporter } =
    useAnchorWebapp();

  const result = useQuery(
    [
      ANCHOR_QUERY_KEY.GOV_MYPOLLS,
      connectedWallet?.walletAddress,
      contractAddress.anchorToken.gov,
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
