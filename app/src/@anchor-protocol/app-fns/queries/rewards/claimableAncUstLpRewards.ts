import {
  anchorToken,
  AncUstLP,
  cw20,
  CW20Addr,
  HumanAddr,
} from '@anchor-protocol/types';
import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';

interface RewardsClaimableAncUstLpRewardsWasmQuery {
  lPBalance: WasmQuery<cw20.Balance, cw20.BalanceResponse<AncUstLP>>;
  lPStakerInfo: WasmQuery<
    anchorToken.staking.StakerInfo,
    anchorToken.staking.StakerInfoResponse
  >;
}

export type RewardsClaimableAncUstLpRewards =
  WasmQueryData<RewardsClaimableAncUstLpRewardsWasmQuery>;

export async function rewardsClaimableAncUstLpRewardsQuery(
  walletAddr: HumanAddr | undefined,
  ancUstLpContract: CW20Addr,
  ancUstLpStakingContract: HumanAddr,
  lastSyncedHeight: () => Promise<number>,
  queryClient: QueryClient,
): Promise<RewardsClaimableAncUstLpRewards | undefined> {
  if (!walletAddr) {
    return undefined;
  }

  const blockHeight = await lastSyncedHeight();

  return wasmFetch<RewardsClaimableAncUstLpRewardsWasmQuery>({
    ...queryClient,
    id: `rewards--claimable-anc-ust-lp-rewards`,
    wasmQuery: {
      lPBalance: {
        contractAddress: ancUstLpContract,
        query: {
          balance: {
            address: walletAddr,
          },
        },
      },
      lPStakerInfo: {
        contractAddress: ancUstLpStakingContract,
        query: {
          staker_info: {
            staker: walletAddr,
            block_height: blockHeight + 1,
          },
        },
      },
    },
  });
}
