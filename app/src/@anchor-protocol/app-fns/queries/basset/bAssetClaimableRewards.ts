import { basset, HumanAddr } from '@anchor-protocol/types';
import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';

interface BAssetClaimableRewardsWasmQuery {
  claimableReward: WasmQuery<
    basset.reward.AccruedRewards,
    basset.reward.AccruedRewardsResponse
  >;
}

export type BAssetClaimableRewards =
  WasmQueryData<BAssetClaimableRewardsWasmQuery>;

export async function bAssetClaimableRewardsQuery(
  walletAddr: HumanAddr | undefined,
  bAssetRewardAddr: HumanAddr,
  queryClient: QueryClient,
): Promise<BAssetClaimableRewards | undefined> {
  if (!walletAddr) {
    return undefined;
  }

  return wasmFetch<BAssetClaimableRewardsWasmQuery>({
    ...queryClient,
    id: `basset--claimable-rewards`,
    wasmQuery: {
      claimableReward: {
        contractAddress: bAssetRewardAddr,
        query: {
          accrued_rewards: {
            address: walletAddr,
          },
        },
      },
    },
  });
}
