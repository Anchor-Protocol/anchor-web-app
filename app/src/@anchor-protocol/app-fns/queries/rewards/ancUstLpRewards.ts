import {
  ANC,
  AncUstLP,
  astroport,
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
  userLPDeposit: WasmQuery<
    astroport.QueryMsg.Deposit,
    astroport.QueryMsg.DepositResponse<AncUstLP>
  >;
  userLPPendingToken: WasmQuery<
    astroport.QueryMsg.PendingToken,
    astroport.QueryMsg.PendingTokenResponse<ANC>
  >;
}

export type RewardsAncUstLpRewards =
  WasmQueryData<RewardsAncUstLpRewardsWasmQuery>;

export async function rewardsAncUstLpRewardsQuery(
  walletAddr: HumanAddr | undefined,
  stakingContract: HumanAddr,
  ancUstLpContract: CW20Addr,
  astroportGeneratorAddr: HumanAddr,
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
      userLPDeposit: {
        contractAddress: astroportGeneratorAddr,
        query: {
          deposit: {
            lp_token: ancUstLpContract,
            user: walletAddr,
          },
        },
      },
      userLPPendingToken: {
        contractAddress: astroportGeneratorAddr,
        query: {
          pending_token: {
            lp_token: ancUstLpContract,
            user: walletAddr,
          },
        },
      },
    },
  });
}
