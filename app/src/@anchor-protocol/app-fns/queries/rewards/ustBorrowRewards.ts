import { HumanAddr, moneyMarket } from '@anchor-protocol/types';
import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';

interface RewardsUstBorrowRewardsWasmQuery {
  borrowerInfo: WasmQuery<
    moneyMarket.market.BorrowerInfo,
    moneyMarket.market.BorrowerInfoResponse
  >;
  marketState: WasmQuery<
    moneyMarket.market.State,
    moneyMarket.market.StateResponse
  >;
}

export type RewardsUstBorrowRewards =
  WasmQueryData<RewardsUstBorrowRewardsWasmQuery>;

export async function rewardsUstBorrowRewardsQuery(
  walletAddr: HumanAddr | undefined,
  marketContract: HumanAddr,
  queryClient: QueryClient,
): Promise<RewardsUstBorrowRewards | undefined> {
  if (!walletAddr) {
    return undefined;
  }

  return wasmFetch<RewardsUstBorrowRewardsWasmQuery>({
    ...queryClient,
    id: `rewards--ust-borrow-rewards`,
    wasmQuery: {
      marketState: {
        contractAddress: marketContract,
        query: {
          state: {},
        },
      },
      borrowerInfo: {
        contractAddress: marketContract,
        query: {
          borrower_info: {
            borrower: walletAddr,
          },
        },
      },
    },
  });
}
