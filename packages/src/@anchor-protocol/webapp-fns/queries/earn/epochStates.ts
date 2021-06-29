import { moneyMarket } from '@anchor-protocol/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@terra-money/webapp-fns';

export interface EarnEpochStatesWasmQuery {
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

export type EarnEpochStatesQueryParams = Omit<
  MantleParams<EarnEpochStatesWasmQuery>,
  'query' | 'variables'
> & {
  lastSyncedHeight: () => Promise<number>;
};

export async function earnEpochStatesQuery({
  mantleEndpoint,
  wasmQuery,
  lastSyncedHeight,
  ...params
}: EarnEpochStatesQueryParams): Promise<EarnEpochStates> {
  const blockHeight = await lastSyncedHeight();

  wasmQuery.moneyMarketEpochState.query.epoch_state.block_height =
    blockHeight + 1;

  return mantle<EarnEpochStatesWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?earn--epoch-states`,
    variables: {},
    wasmQuery,
    ...params,
  });
}
