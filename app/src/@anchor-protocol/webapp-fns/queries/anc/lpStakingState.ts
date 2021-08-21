import { anchorToken } from '@anchor-protocol/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@packages/webapp-fns';

export interface AncLpStakingStateWasmQuery {
  lpStakingState: WasmQuery<
    anchorToken.staking.State,
    anchorToken.staking.StateResponse
  >;
}

export type AncLpStakingState = WasmQueryData<AncLpStakingStateWasmQuery>;

export type AncLpStakingStateQueryParams = Omit<
  MantleParams<AncLpStakingStateWasmQuery>,
  'query' | 'variables'
>;

export async function ancLpStakingStateQuery({
  mantleEndpoint,
  wasmQuery,
  ...params
}: AncLpStakingStateQueryParams): Promise<AncLpStakingState> {
  return mantle<AncLpStakingStateWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?anc--lp-staking-state`,
    variables: {},
    wasmQuery,
    ...params,
  });
}
