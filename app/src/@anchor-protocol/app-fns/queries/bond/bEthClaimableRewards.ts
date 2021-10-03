import { beth, HumanAddr } from '@anchor-protocol/types';
import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';

interface BondBEthClaimableRewardsWasmQuery {
  claimableReward: WasmQuery<
    beth.rewards.AccruedRewards,
    beth.rewards.AccruedRewardsResponse
  >;
}

export type BondBEthClaimableRewards =
  WasmQueryData<BondBEthClaimableRewardsWasmQuery>;

export async function bondBEthClaimableRewardsQuery(
  walletAddr: HumanAddr | undefined,
  bEthRewardAddr: HumanAddr,
  queryClient: QueryClient,
): Promise<BondBEthClaimableRewards | undefined> {
  if (!walletAddr) {
    return undefined;
  }

  return wasmFetch<BondBEthClaimableRewardsWasmQuery>({
    ...queryClient,
    id: `bond--beth-claimable-rewards`,
    wasmQuery: {
      claimableReward: {
        contractAddress: bEthRewardAddr,
        query: {
          accrued_rewards: {
            address: walletAddr,
          },
        },
      },
    },
  });
}
