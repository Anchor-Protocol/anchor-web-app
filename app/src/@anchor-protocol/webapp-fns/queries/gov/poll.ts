import { anchorToken, HumanAddr } from '@anchor-protocol/types';
import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';

interface GovPollWasmQuery {
  poll: WasmQuery<anchorToken.gov.Poll, anchorToken.gov.PollResponse>;
}

export type GovPoll = WasmQueryData<GovPollWasmQuery>;

export async function govPollQuery(
  govContract: HumanAddr,
  pollId: number,
  queryClient: QueryClient,
): Promise<GovPoll> {
  return wasmFetch<GovPollWasmQuery>({
    ...queryClient,
    id: `gov--poll&poll=${pollId}`,
    wasmQuery: {
      poll: {
        contractAddress: govContract,
        query: {
          poll: {
            poll_id: pollId,
          },
        },
      },
    },
  });
}
