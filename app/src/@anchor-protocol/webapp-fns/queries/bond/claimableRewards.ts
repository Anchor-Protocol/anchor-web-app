import { bluna, HumanAddr } from '@anchor-protocol/types';
import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';

interface BondClaimableRewardsWasmQuery {
  rewardState: WasmQuery<bluna.reward.State, bluna.reward.StateResponse>;
  claimableReward: WasmQuery<bluna.reward.Holder, bluna.reward.HolderResponse>;
}

export type BondClaimableRewards = WasmQueryData<BondClaimableRewardsWasmQuery>;

export async function bondClaimableRewardsQuery(
  walletAddr: HumanAddr | undefined,
  bAssetRewardContract: HumanAddr,
  queryClient: QueryClient,
): Promise<BondClaimableRewards | undefined> {
  if (!walletAddr) {
    return undefined;
  }

  return wasmFetch<BondClaimableRewardsWasmQuery>({
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
