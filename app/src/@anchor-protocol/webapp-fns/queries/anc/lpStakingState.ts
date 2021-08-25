import { anchorToken, HumanAddr } from '@anchor-protocol/types';
import {
  defaultMantleFetch,
  mantle,
  MantleFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/webapp-fns';

interface AncLpStakingStateWasmQuery {
  lpStakingState: WasmQuery<
    anchorToken.staking.State,
    anchorToken.staking.StateResponse
  >;
}

export type AncLpStakingState = WasmQueryData<AncLpStakingStateWasmQuery>;

export async function ancLpStakingStateQuery(
  ancStakingAddr: HumanAddr,
  mantleEndpoint: string,
  mantleFetch: MantleFetch = defaultMantleFetch,
  requestInit?: RequestInit,
): Promise<AncLpStakingState> {
  return mantle<AncLpStakingStateWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?anc--lp-staking-state`,
    mantleFetch,
    requestInit,
    variables: {},
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
