import { HumanAddr, moneyMarket } from '@anchor-protocol/types';
import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';

interface BorrowBorrowerWasmQuery {
  marketBorrowerInfo: WasmQuery<
    moneyMarket.market.BorrowerInfo,
    moneyMarket.market.BorrowerInfoResponse
  >;
  overseerCollaterals: WasmQuery<
    moneyMarket.overseer.Collaterals,
    moneyMarket.overseer.CollateralsResponse
  >;
  overseerBorrowLimit: WasmQuery<
    moneyMarket.overseer.BorrowLimit,
    moneyMarket.overseer.BorrowLimitResponse
  >;
}

export type BorrowBorrower = WasmQueryData<BorrowBorrowerWasmQuery> & {
  blockHeight: number;
};

export async function borrowBorrowerQuery(
  walletAddr: HumanAddr | undefined,
  lastSyncedHeight: () => Promise<number>,
  marketContract: HumanAddr,
  overseerContract: HumanAddr,
  queryClient: QueryClient,
): Promise<BorrowBorrower | undefined> {
  if (!walletAddr) {
    return undefined;
  }

  const blockHeight = await lastSyncedHeight();

  const { marketBorrowerInfo, overseerCollaterals, overseerBorrowLimit } =
    await wasmFetch<BorrowBorrowerWasmQuery>({
      ...queryClient,
      id: `borrow--borrower`,
      wasmQuery: {
        marketBorrowerInfo: {
          contractAddress: marketContract,
          query: {
            borrower_info: {
              borrower: walletAddr,
              block_height: blockHeight + 1,
            },
          },
        },
        overseerCollaterals: {
          contractAddress: overseerContract,
          query: {
            collaterals: {
              borrower: walletAddr,
            },
          },
        },
        overseerBorrowLimit: {
          contractAddress: overseerContract,
          query: {
            borrow_limit: {
              borrower: walletAddr,
              block_time: blockHeight + 1,
            },
          },
        },
      },
    });

  return {
    marketBorrowerInfo,
    overseerCollaterals,
    overseerBorrowLimit,
    blockHeight: blockHeight + 1,
  };
}
