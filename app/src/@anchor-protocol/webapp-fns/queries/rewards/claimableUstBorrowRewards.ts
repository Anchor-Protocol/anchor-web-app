import {
  ANC,
  cw20,
  CW20Addr,
  HumanAddr,
  moneyMarket,
} from '@anchor-protocol/types';
import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';

interface RewardsClaimableUstBorrowRewardsWasmQuery {
  borrowerInfo: WasmQuery<
    moneyMarket.market.BorrowerInfo,
    moneyMarket.market.BorrowerInfoResponse
  >;
  userANCBalance: WasmQuery<cw20.Balance, cw20.BalanceResponse<ANC>>;
  marketState: WasmQuery<
    moneyMarket.market.State,
    moneyMarket.market.StateResponse
  >;
}

export type RewardsClaimableUstBorrowRewards =
  WasmQueryData<RewardsClaimableUstBorrowRewardsWasmQuery>;

export async function rewardsClaimableUstBorrowRewardsQuery(
  walletAddr: HumanAddr | undefined,
  ancContract: CW20Addr,
  marketContract: HumanAddr,
  lastSyncedHeight: () => Promise<number>,
  queryClient: QueryClient,
): Promise<RewardsClaimableUstBorrowRewards | undefined> {
  if (!walletAddr) {
    return undefined;
  }

  const blockHeight = await lastSyncedHeight();

  return wasmFetch<RewardsClaimableUstBorrowRewardsWasmQuery>({
    ...queryClient,
    id: `rewards--claimable-ust-borrow-rewards`,
    wasmQuery: {
      borrowerInfo: {
        contractAddress: marketContract,
        query: {
          borrower_info: {
            borrower: walletAddr,
            block_height: blockHeight + 1,
          },
        },
      },
      marketState: {
        contractAddress: marketContract,
        query: {
          state: {},
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
