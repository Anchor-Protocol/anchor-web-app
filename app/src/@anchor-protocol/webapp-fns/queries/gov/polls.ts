import { anchorToken } from '@anchor-protocol/types';
import { mantle, MantleParams, WasmQuery, WasmQueryData } from '@libs/mantle';

export interface GovPollsWasmQuery {
  polls: WasmQuery<anchorToken.gov.Polls, anchorToken.gov.PollsResponse>;
}

export type GovPolls = WasmQueryData<GovPollsWasmQuery>;

export type GovPollsQueryParams = Omit<
  MantleParams<GovPollsWasmQuery>,
  'query' | 'variables'
>;

export async function govPollsQuery({
  mantleEndpoint,
  wasmQuery,
  ...params
}: GovPollsQueryParams): Promise<GovPolls> {
  const startAfter = wasmQuery.polls.query.polls.start_after
    ? `&start_after=${wasmQuery.polls.query.polls.start_after}`
    : '';

  return mantle<GovPollsWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?gov--polls${startAfter}`,
    variables: {},
    wasmQuery,
    ...params,
  });
}
