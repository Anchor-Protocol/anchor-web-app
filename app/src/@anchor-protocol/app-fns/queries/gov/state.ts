import { anchorToken, HumanAddr } from '@anchor-protocol/types';
import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';

interface GovStateWasmQuery {
  govState: WasmQuery<anchorToken.gov.State, anchorToken.gov.StateResponse>;
  govConfig: WasmQuery<anchorToken.gov.Config, anchorToken.gov.ConfigResponse>;
}

export type GovState = WasmQueryData<GovStateWasmQuery>;

export async function govStateQuery(
  govContract: HumanAddr,
  queryClient: QueryClient,
): Promise<GovState> {
  return wasmFetch<GovStateWasmQuery>({
    ...queryClient,
    id: `gov--state`,
    wasmQuery: {
      govState: {
        contractAddress: govContract,
        query: {
          state: {},
        },
      },
      govConfig: {
        contractAddress: govContract,
        query: {
          config: {},
        },
      },
    },
  });
}
