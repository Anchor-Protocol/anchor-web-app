import { bluna, HumanAddr } from '@anchor-protocol/types';
import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';

interface BLunaClaimableRewardsWasmQuery {
  rewardState: WasmQuery<bluna.reward.State, bluna.reward.StateResponse>;
  claimableReward: WasmQuery<bluna.reward.Holder, bluna.reward.HolderResponse>;
}

export type BLunaClaimableRewards =
  WasmQueryData<BLunaClaimableRewardsWasmQuery>;

export async function bLunaClaimableRewardsQuery(
  walletAddr: HumanAddr | undefined,
  bAssetRewardContract: HumanAddr,
  queryClient: QueryClient,
): Promise<BLunaClaimableRewards | undefined> {
  if (!walletAddr) {
    return undefined;
  }

  return wasmFetch<BLunaClaimableRewardsWasmQuery>({
    ...queryClient,
    id: `bond--claimable-rewards`,
    wasmQuery: {
      rewardState: {
        contractAddress: bAssetRewardContract,
        query: {
          state: {},
        },
      },
      claimableReward: {
        contractAddress: bAssetRewardContract,
        query: {
          holder: {
            address: walletAddr,
          },
        },
      },
    },
  });
}
