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
import { sum } from '@libs/big-math';

interface GaugeVote {
  address: CW20Addr;
  amount: u<veANC<BigSource>>;
  lockPeriodEndsAt: MillisTimestamp;
}

interface UserVotesWasmQuery {
  voter: WasmQuery<
    anchorToken.gaugeController.Voter,
    anchorToken.gaugeController.VoterResponse
  >;
}

interface UserGaugeVotes {
  votes: GaugeVote[];
  votesRecord: Record<CW20Addr, GaugeVote>;
  total: u<veANC<BigSource>>;
}

const userGaugeVotesQuery = async (
  gaugeControllerContract: string,
  user: HumanAddr,
  queryClient: QueryClient,
): Promise<UserGaugeVotes> => {
  const { voter } = await wasmFetch<UserVotesWasmQuery>({
    ...queryClient,
    id: 'gauge-votes',
    wasmQuery: {
      voter: {
        contractAddress: gaugeControllerContract,
        query: {
          voter: {
            address: user,
          },
        },
      },
    },
  });

  // TODO: convert lockPeriodEndsAt
  const votes: GaugeVote[] = voter.votes.map(
    ({ gauge_addr, vote_amount, next_vote_time }) => ({
      address: gauge_addr,
      amount: vote_amount,
      lockPeriodEndsAt: next_vote_time as MillisTimestamp,
    }),
  );

  const votesRecord = votes.reduce(
    (acc, vote) => ({
      ...acc,
      [vote.address]: vote,
    }),
    {} as Record<CW20Addr, GaugeVote>,
  );

  return {
    votes,
    votesRecord,
    total: sum(...votes.map((vote) => vote.amount)) as u<veANC<BigSource>>,
  };
};

const userGaugeVotesQueryFn = createQueryFn(userGaugeVotesQuery);

export const useMyGaugeVotesQuery = () => {
  const { queryClient, contractAddress, queryErrorReporter } =
    useAnchorWebapp();

  const { terraWalletAddress } = useAccount();

  const gaugeControllerContract = contractAddress.anchorToken.gaugeController;

  return useQuery(
    [
      ANCHOR_QUERY_KEY.MY_GAUGE_VOTES,
      gaugeControllerContract,
      terraWalletAddress as HumanAddr,
      queryClient,
    ],
    userGaugeVotesQueryFn,
    {
      refetchOnMount: false,
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: false,
      enabled: !!terraWalletAddress && !!gaugeControllerContract,
      onError: queryErrorReporter,
    },
  );
};
