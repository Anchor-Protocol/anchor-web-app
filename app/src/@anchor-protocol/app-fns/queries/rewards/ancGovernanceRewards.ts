import {
  ANC,
  anchorToken,
  cw20,
  CW20Addr,
  HumanAddr,
  u,
} from '@anchor-protocol/types';
import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';

interface RewardsAncGovernanceRewardsWasmQuery {
  userGovStakingInfo: WasmQuery<
    anchorToken.gov.Staker,
    anchorToken.gov.StakerResponse
  >;
  userANCBalance: WasmQuery<cw20.Balance, cw20.BalanceResponse<u<ANC>>>;
}

export type RewardsAncGovernanceRewards =
  WasmQueryData<RewardsAncGovernanceRewardsWasmQuery>;

export async function rewardsAncGovernanceRewardsQuery(
  walletAddr: HumanAddr | undefined,
  govContract: HumanAddr,
  ancContract: CW20Addr,
  queryClient: QueryClient,
): Promise<RewardsAncGovernanceRewards | undefined> {
  if (!walletAddr) {
    return undefined;
  }

  return wasmFetch<RewardsAncGovernanceRewardsWasmQuery>({
    ...queryClient,
    id: `rewards--anc-governance-rewards`,
    wasmQuery: {
      userGovStakingInfo: {
        contractAddress: govContract,
        query: {
          staker: {
            address: walletAddr,
          },
        },
      },
      userANCBalance: {
        contractAddress: ancContract,
        query: {
          balance: {
            address: walletAddr,
          },
        },
      },
    },
  });
}
