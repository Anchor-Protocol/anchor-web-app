import { anchorToken, HumanAddr } from '@anchor-protocol/types';
import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';

interface AncLpStakingStateWasmQuery {
  lpStakingState: WasmQuery<
    anchorToken.staking.State,
    anchorToken.staking.StateResponse
  >;
}

export type AncLpStakingState = WasmQueryData<AncLpStakingStateWasmQuery>;

export async function ancLpStakingStateQuery(
  ancStakingAddr: HumanAddr,
  queryClient: QueryClient,
): Promise<AncLpStakingState> {
  return wasmFetch<AncLpStakingStateWasmQuery>({
    ...queryClient,
    id: `anc--lp-staking-state`,
    wasmQuery: {
      lpStakingState: {
        contractAddress: ancStakingAddr,
        query: {
          state: {},
        },
      },
    },
  });
}
