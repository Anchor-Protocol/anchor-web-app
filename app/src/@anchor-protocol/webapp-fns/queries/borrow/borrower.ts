import { moneyMarket } from '@anchor-protocol/types';
import { mantle, MantleParams, WasmQuery, WasmQueryData } from '@libs/mantle';

export interface BorrowBorrowerWasmQuery {
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

export type BorrowBorrowerQueryParams = Omit<
  MantleParams<BorrowBorrowerWasmQuery>,
  'query' | 'variables'
> & {
  lastSyncedHeight: () => Promise<number>;
};

export async function borrowBorrowerQuery({
  mantleEndpoint,
  wasmQuery,
  lastSyncedHeight,
  ...params
}: BorrowBorrowerQueryParams): Promise<BorrowBorrower> {
  const blockHeight = await lastSyncedHeight();

  wasmQuery.marketBorrowerInfo.query.borrower_info.block_height =
    blockHeight + 1;

  wasmQuery.overseerBorrowLimit.query.borrow_limit.block_time = blockHeight + 1;

  const { marketBorrowerInfo, overseerCollaterals, overseerBorrowLimit } =
    await mantle<BorrowBorrowerWasmQuery>({
      mantleEndpoint: `${mantleEndpoint}?borrow--borrower`,
      variables: {},
      wasmQuery,
      ...params,
    });

  return {
    marketBorrowerInfo,
    overseerCollaterals,
    overseerBorrowLimit,
    //bLunaCustodyBorrower,
    //bEthCustodyBorrower,
    blockHeight: blockHeight + 1,
  };
}
