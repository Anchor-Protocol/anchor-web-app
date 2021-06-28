import { moneyMarket } from '@anchor-protocol/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@terra-money/webapp-fns';

export interface EarnEpochStates {
  moneyMarketEpochState: WasmQuery<
    moneyMarket.market.EpochState,
    moneyMarket.market.EpochStateResponse
  >;
  overseerEpochState: WasmQuery<
    moneyMarket.overseer.EpochState,
    moneyMarket.overseer.EpochStateResponse
  >;
}

export type EarnEpochStatesQueryParams = Omit<
  MantleParams<EarnEpochStates>,
  'variables'
> & {
  lastSyncedHeight: () => Promise<number>;
};

export async function earnEpochStatesQuery({
  mantleFetch,
  mantleEndpoint,
  wasmQuery,
  lastSyncedHeight,
}: EarnEpochStatesQueryParams): Promise<WasmQueryData<EarnEpochStates>> {
  const blockHeight = await lastSyncedHeight();

  wasmQuery.moneyMarketEpochState.query.epoch_state.block_height =
    blockHeight + 1;

  return await mantle<EarnEpochStates>({
    mantleEndpoint: `${mantleEndpoint}?earn--epoch-states`,
    mantleFetch,
    variables: {},
    wasmQuery,
  });
}
