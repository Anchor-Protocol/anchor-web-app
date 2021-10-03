import { bluna, HumanAddr } from '@anchor-protocol/types';
import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';

interface BondBLunaExchangeRateWasmQuery {
  state: WasmQuery<bluna.hub.State, bluna.hub.StateResponse>;
  parameters: WasmQuery<bluna.hub.Parameters, bluna.hub.ParametersResponse>;
}

export type BondBLunaExchangeRate =
  WasmQueryData<BondBLunaExchangeRateWasmQuery>;

export async function bondBLunaExchangeRateQuery(
  bLunaHubContract: HumanAddr,
  queryClient: QueryClient,
): Promise<BondBLunaExchangeRate> {
  return wasmFetch<BondBLunaExchangeRateWasmQuery>({
    ...queryClient,
    id: `bond--bluna-exchange-rate`,
    wasmQuery: {
      state: {
        contractAddress: bLunaHubContract,
        query: {
          state: {},
        },
      },
      parameters: {
        contractAddress: bLunaHubContract,
        query: {
          parameters: {},
        },
      },
    },
  });
}
