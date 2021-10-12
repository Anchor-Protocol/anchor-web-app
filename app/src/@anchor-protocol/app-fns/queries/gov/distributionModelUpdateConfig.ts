import { HumanAddr, moneyMarket } from '@anchor-protocol/types';
import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';

interface GovDistributionModelUpdateConfigWasmQuery {
  distributionModelConfig: WasmQuery<
    moneyMarket.distributionModel.Config,
    moneyMarket.distributionModel.ConfigResponse
  >;
}

export type GovDistributionModelUpdateConfig =
  WasmQueryData<GovDistributionModelUpdateConfigWasmQuery>;

export async function govDistributionModelUpdateConfigQuery(
  distributionModelContract: HumanAddr,
  queryClient: QueryClient,
): Promise<GovDistributionModelUpdateConfig> {
  return wasmFetch<GovDistributionModelUpdateConfigWasmQuery>({
    ...queryClient,
    id: `gov--distribution-model-update-config`,
    wasmQuery: {
      distributionModelConfig: {
        contractAddress: distributionModelContract,
        query: {
          config: {},
        },
      },
    },
  });
}
