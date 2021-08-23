import { anchorToken, HumanAddr, uANC } from '@anchor-protocol/types';
import { mantle, MantleParams, WasmQuery } from '@libs/mantle';

export type MyPoll = anchorToken.gov.PollResponse & {
  my: { vote: 'yes' | 'no'; balance: uANC } | undefined;
};

interface PollsWasmQuery {
  polls: WasmQuery<anchorToken.gov.Polls, anchorToken.gov.PollsResponse>;
}

interface StakerWasmQuery {
  staker: WasmQuery<anchorToken.gov.Staker, anchorToken.gov.StakerResponse>;
}

export type GovMyPollsQueryParams = Omit<
  MantleParams<{}>,
  'query' | 'variables' | 'wasmQuery'
> & {
  govContract: HumanAddr;
  walletAddress: HumanAddr;
};

export async function govMyPollsQuery({
  mantleEndpoint,
  govContract,
  walletAddress,
  ...mantleParams
}: GovMyPollsQueryParams): Promise<MyPoll[]> {
  const { polls } = await mantle<PollsWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?gov--my-polls`,
    variables: {},
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
    ...mantleParams,
  });

  if (polls.polls.length === 0) {
    return [];
  }

  const { staker } = await mantle<StakerWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?gov--my-polls-staker`,
    variables: {},
    wasmQuery: {
      staker: {
        contractAddress: govContract,
        query: {
          staker: {
            address: walletAddress,
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
