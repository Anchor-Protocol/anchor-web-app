import { HumanAddr, moneyMarket, u, UST } from '@anchor-protocol/types';
import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';

interface MarketStableCoinWasmQuery {
  borrowRate: WasmQuery<
    moneyMarket.interestModel.BorrowRate,
    moneyMarket.interestModel.BorrowRateResponse
  >;
  epochState: WasmQuery<
    moneyMarket.overseer.EpochState,
    moneyMarket.overseer.EpochStateResponse
  >;
}

export type MarketStableCoin = WasmQueryData<MarketStableCoinWasmQuery>;

export async function marketStableCoinQuery(
  interestContract: HumanAddr,
  overseerContract: HumanAddr,
  uUSTBalance: u<UST> | undefined,
  totalReserves: u<UST> | undefined,
  totalLiabilities: u<UST> | undefined,
  queryClient: QueryClient,
): Promise<MarketStableCoin | undefined> {
  if (!uUSTBalance || !totalReserves || !totalLiabilities) {
    return undefined;
  }

  return wasmFetch<MarketStableCoinWasmQuery>({
    ...queryClient,
    id: `market--stable-coin`,
    wasmQuery: {
      borrowRate: {
        contractAddress: interestContract,
        query: {
          borrow_rate: {
            market_balance: uUSTBalance,
            total_reserves: totalReserves,
            total_liabilities: totalLiabilities,
          },
        },
      },
      epochState: {
        contractAddress: overseerContract,
        query: {
          epoch_state: {},
        },
      },
    },
  });
}
