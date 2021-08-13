import { anchorToken } from '@anchor-protocol/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@terra-money/webapp-fns';

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
  return mantle<GovPollsWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?gov--polls&start_after=${wasmQuery.polls.query.polls.start_after}`,
    variables: {},
    wasmQuery,
    ...params,
  });
}
