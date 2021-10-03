import { HumanAddr, moneyMarket } from '@anchor-protocol/types';
import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';

interface EarnEpochStatesWasmQuery {
  moneyMarketEpochState: WasmQuery<
    moneyMarket.market.EpochState,
    moneyMarket.market.EpochStateResponse
  >;
  overseerEpochState: WasmQuery<
    moneyMarket.overseer.EpochState,
    moneyMarket.overseer.EpochStateResponse
  >;
}

export type EarnEpochStates = WasmQueryData<EarnEpochStatesWasmQuery>;

export async function earnEpochStatesQuery(
  moneyMarketContract: HumanAddr,
  overseerContract: HumanAddr,
  lastSyncedHeight: () => Promise<number>,
  queryClient: QueryClient,
): Promise<EarnEpochStates> {
  const blockHeight = await lastSyncedHeight();

  return wasmFetch<EarnEpochStatesWasmQuery>({
    ...queryClient,
    id: `earn--epoch-states`,
    wasmQuery: {
      moneyMarketEpochState: {
        contractAddress: moneyMarketContract,
        query: {
          epoch_state: {
            block_height: blockHeight + 1,
          },
        },
      },
      overseerEpochState: {
        contractAddress: overseerContract,
        query: {
          epoch_state: {},
        },
      },
    },
  });
}
