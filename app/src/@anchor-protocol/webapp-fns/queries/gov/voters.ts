import { anchorToken } from '@anchor-protocol/types';
import { mantle, MantleParams, WasmQuery, WasmQueryData } from '@libs/mantle';

export interface GovVotersWasmQuery {
  voters: WasmQuery<anchorToken.gov.Voters, anchorToken.gov.VotersResponse>;
}

export type GovVoters = WasmQueryData<GovVotersWasmQuery>;

export type GovVotersQueryParams = Omit<
  MantleParams<GovVotersWasmQuery>,
  'query' | 'variables'
>;

export async function govVotersQuery({
  mantleEndpoint,
  wasmQuery,
  ...params
}: GovVotersQueryParams): Promise<GovVoters> {
  return mantle<GovVotersWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?gov--voters&start_after=${wasmQuery.voters.query.voters.start_after}`,
    variables: {},
    wasmQuery,
    ...params,
  });
}
