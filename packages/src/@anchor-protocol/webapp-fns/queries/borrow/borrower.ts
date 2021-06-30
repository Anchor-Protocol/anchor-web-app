import { moneyMarket } from '@anchor-protocol/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@terra-money/webapp-fns';

export interface BorrowBorrowerWasmQuery {
  marketBorrowerInfo: WasmQuery<
    moneyMarket.market.BorrowerInfo,
    moneyMarket.market.BorrowerInfoResponse
  >;
  custodyBorrower: WasmQuery<
    moneyMarket.custody.Borrower,
    moneyMarket.custody.BorrowerResponse
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

  const { marketBorrowerInfo, custodyBorrower } =
    await mantle<BorrowBorrowerWasmQuery>({
      mantleEndpoint: `${mantleEndpoint}?borrow--borrower`,
      variables: {},
      wasmQuery,
      ...params,
    });

  return {
    marketBorrowerInfo,
    custodyBorrower,
    blockHeight: blockHeight + 1,
  };
}
