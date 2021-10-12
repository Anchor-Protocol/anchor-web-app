import { anchorToken, HumanAddr } from '@anchor-protocol/types';
import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';

interface GovPollsWasmQuery {
  polls: WasmQuery<anchorToken.gov.Polls, anchorToken.gov.PollsResponse>;
}

export type GovPolls = WasmQueryData<GovPollsWasmQuery>;

export async function govPollsQuery(
  govContract: HumanAddr,
  pollsQuery: anchorToken.gov.Polls['polls'],
  queryClient: QueryClient,
): Promise<GovPolls> {
  const startAfter = pollsQuery.start_after
    ? `&start_after=${pollsQuery.start_after}`
    : '';

  return wasmFetch<GovPollsWasmQuery>({
    ...queryClient,
    id: `gov--polls${startAfter}`,
    wasmQuery: {
      polls: {
        contractAddress: govContract,
        query: {
          polls: pollsQuery,
        },
      },
    },
  });
}
