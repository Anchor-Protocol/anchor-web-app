import { anchorToken } from '@anchor-protocol/types';
import { mantle, MantleParams, WasmQuery, WasmQueryData } from '@libs/mantle';

export interface GovPollWasmQuery {
  poll: WasmQuery<anchorToken.gov.Poll, anchorToken.gov.PollResponse>;
}

export type GovPoll = WasmQueryData<GovPollWasmQuery>;

export type GovPollQueryParams = Omit<
  MantleParams<GovPollWasmQuery>,
  'query' | 'variables'
>;

export async function govPollQuery({
  mantleEndpoint,
  wasmQuery,
  ...params
}: GovPollQueryParams): Promise<GovPoll> {
  return mantle<GovPollWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?gov--poll&poll=${wasmQuery.poll.query.poll.poll_id}`,
    variables: {},
    wasmQuery,
    ...params,
  });
}
