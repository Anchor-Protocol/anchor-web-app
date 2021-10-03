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

interface RewardsAncUstLpRewardsWasmQuery {
  userLPBalance: WasmQuery<cw20.Balance, cw20.BalanceResponse<AncUstLP>>;
  userLPStakingInfo: WasmQuery<
    anchorToken.staking.StakerInfo,
    anchorToken.staking.StakerInfoResponse
  >;
}

export type RewardsAncUstLpRewards =
  WasmQueryData<RewardsAncUstLpRewardsWasmQuery>;

export async function rewardsAncUstLpRewardsQuery(
  walletAddr: HumanAddr | undefined,
  stakingContract: HumanAddr,
  ancUstLpContract: CW20Addr,
  queryClient: QueryClient,
): Promise<RewardsAncUstLpRewards | undefined> {
  if (!walletAddr) {
    return undefined;
  }

  return wasmFetch<RewardsAncUstLpRewardsWasmQuery>({
    ...queryClient,
    id: `rewards--anc-ust-lp-rewards`,
    wasmQuery: {
      userLPBalance: {
        contractAddress: ancUstLpContract,
        query: {
          balance: {
            address: walletAddr,
          },
        },
      },
      userLPStakingInfo: {
        contractAddress: stakingContract,
        query: {
          staker_info: {
            staker: walletAddr,
          },
        },
      },
    },
  });
}
