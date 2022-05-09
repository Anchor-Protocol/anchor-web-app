import {
  ANCHOR_QUERY_KEY,
  useAnchorWebapp,
} from '@anchor-protocol/app-provider';
import { useAccount } from 'contexts/account';
import { useQuery } from 'react-query';
import { CW20Addr, HumanAddr, MillisTimestamp, u } from '@libs/types';
import { BigSource } from 'big.js';
import { veANC } from '@anchor-protocol/types';
import { createQueryFn } from '@libs/react-query-utils';
import { wasmFetch, WasmQuery, QueryClient } from '@libs/query-client';
import { anchorToken } from '@anchor-protocol/types';

interface GaugeVote {
  address: CW20Addr;
  amount: u<veANC<BigSource>>;
  lockPeriodEndsAt: MillisTimestamp;
}

interface UserVotesWasmQuery {
  voter: WasmQuery<
    anchorToken.votingEscrow.Voter,
    anchorToken.votingEscrow.VoterResponse
  >;
}

const userGaugeVotesQuery = async (
  votingEscrowContract: string,
  user: HumanAddr,
  queryClient: QueryClient,
): Promise<GaugeVote[]> => {
  const {
    voter: { votes },
  } = await wasmFetch<UserVotesWasmQuery>({
    ...queryClient,
    id: 'gauge-votes',
    wasmQuery: {
      voter: {
        contractAddress: votingEscrowContract,
        query: {
          voter: {
            address: user,
          },
        },
      },
    },
  });

  // TODO: convert lockPeriodEndsAt
  return votes.map(({ gauge_addr, vote_amount, next_vote_time }) => ({
    address: gauge_addr,
    amount: vote_amount,
    lockPeriodEndsAt: next_vote_time as MillisTimestamp,
  }));
};

const userGaugeVotesQueryFn = createQueryFn(userGaugeVotesQuery);

export const useMyGaugeVotesQuery = () => {
  const { queryClient, contractAddress, queryErrorReporter } =
    useAnchorWebapp();

  const { terraWalletAddress } = useAccount();

  const votingEscrowContract = contractAddress.anchorToken.votingEscrow;

  return useQuery(
    [
      ANCHOR_QUERY_KEY.MY_GAUGE_VOTES,
      votingEscrowContract,
      terraWalletAddress as HumanAddr,
      queryClient,
    ],
    userGaugeVotesQueryFn,
    {
      refetchOnMount: false,
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: false,
      enabled: !!terraWalletAddress && !!votingEscrowContract,
      onError: queryErrorReporter,
    },
  );
};
