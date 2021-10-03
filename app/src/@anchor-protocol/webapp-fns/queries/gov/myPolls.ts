import { ANC, anchorToken, HumanAddr, u } from '@anchor-protocol/types';
import { QueryClient, wasmFetch, WasmQuery } from '@libs/query-client';

export type MyPoll = anchorToken.gov.PollResponse & {
  my: { vote: 'yes' | 'no'; balance: u<ANC> } | undefined;
};

interface PollsWasmQuery {
  polls: WasmQuery<anchorToken.gov.Polls, anchorToken.gov.PollsResponse>;
}

interface StakerWasmQuery {
  staker: WasmQuery<anchorToken.gov.Staker, anchorToken.gov.StakerResponse>;
}

export async function govMyPollsQuery(
  walletAddr: HumanAddr | undefined,
  govContract: HumanAddr,
  queryClient: QueryClient,
): Promise<MyPoll[]> {
  if (!walletAddr) {
    return [];
  }

  const { polls } = await wasmFetch<PollsWasmQuery>({
    ...queryClient,
    id: `gov--my-polls`,
    wasmQuery: {
      polls: {
        contractAddress: govContract,
        query: {
          polls: {
            filter: 'in_progress',
            order_by: 'desc',
          },
        },
      },
    },
  });

  if (polls.polls.length === 0) {
    return [];
  }

  const { staker } = await wasmFetch<StakerWasmQuery>({
    ...queryClient,
    id: `gov--my-polls-staker`,
    wasmQuery: {
      staker: {
        contractAddress: govContract,
        query: {
          staker: {
            address: walletAddr,
          },
        },
      },
    },
  });

  const myPolls: MyPoll[] = polls.polls.map((poll) => {
    const locked_balance = staker.locked_balance.find(
      ([pollId]) => pollId === poll.id,
    );

    return {
      ...poll,
      my: locked_balance?.[1],
    };
  });

  return myPolls;
}
