import { anchorToken, HumanAddr } from '@anchor-protocol/types';
import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';

interface GovVotersWasmQuery {
  voters: WasmQuery<anchorToken.gov.Voters, anchorToken.gov.VotersResponse>;
}

export type GovVoters = WasmQueryData<GovVotersWasmQuery>;

export async function govVotersQuery(
  govContract: HumanAddr,
  votersQuery: anchorToken.gov.Voters['voters'],
  queryClient: QueryClient,
): Promise<GovVoters> {
  return wasmFetch<GovVotersWasmQuery>({
    ...queryClient,
    id: `gov--voters&start_after=${votersQuery.start_after}`,
    wasmQuery: {
      voters: {
        contractAddress: govContract,
        query: {
          voters: votersQuery,
        },
      },
    },
  });
}
