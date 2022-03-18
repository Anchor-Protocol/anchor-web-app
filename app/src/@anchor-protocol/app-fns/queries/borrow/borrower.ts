import {
  ANC,
  HumanAddr,
  moneyMarket,
  Num,
  u,
  UST,
} from '@anchor-protocol/types';
import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';
import { TERRA_ADDRESS_UNKNOWN } from '../utils';

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
  const blockHeight = await lastSyncedHeight();

  if (!walletAddr) {
    return {
      marketBorrowerInfo: {
        borrower: TERRA_ADDRESS_UNKNOWN,
        interest_index: '0' as Num<string>,
        reward_index: '0' as Num<string>,
        loan_amount: '0' as u<UST>,
        pending_rewards: '0' as u<ANC>,
      },
      overseerCollaterals: {
        borrower: TERRA_ADDRESS_UNKNOWN,
        collaterals: [],
      },
      overseerBorrowLimit: {
        borrower: TERRA_ADDRESS_UNKNOWN,
        borrow_limit: '0' as Num<string>,
      },
      blockHeight: blockHeight + 1,
    };
  }

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
