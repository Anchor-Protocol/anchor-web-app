import { anchorToken, HumanAddr } from '@anchor-protocol/types';
import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';

interface GovConfigWasmQuery {
  govConfig: WasmQuery<anchorToken.gov.Config, anchorToken.gov.ConfigResponse>;
}

export type GovConfig = WasmQueryData<GovConfigWasmQuery>;

export async function govConfigQuery(
  govContract: HumanAddr,
  queryClient: QueryClient,
): Promise<GovConfig> {
  return wasmFetch<GovConfigWasmQuery>({
    ...queryClient,
    id: `gov--config`,
    wasmQuery: {
      govConfig: {
        contractAddress: govContract,
        query: {
          config: {},
        },
      },
    },
  });
}
