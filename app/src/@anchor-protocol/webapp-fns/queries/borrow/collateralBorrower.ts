import { moneyMarket } from '@anchor-protocol/types';
import { mantle, MantleParams, WasmQuery, WasmQueryData } from '@libs/mantle';

export interface BorrowCollateralBorrowerWasmQuery {
  custodyBorrower: WasmQuery<
    moneyMarket.custody.Borrower,
    moneyMarket.custody.BorrowerResponse
  >;
}

export type BorrowCollateralBorrower =
  WasmQueryData<BorrowCollateralBorrowerWasmQuery>;

export type BorrowCollateralBorrowerQueryParams = Omit<
  MantleParams<BorrowCollateralBorrowerWasmQuery>,
  'query' | 'variables'
>;

export async function borrowCollateralBorrowerQuery({
  mantleEndpoint,
  ...params
}: BorrowCollateralBorrowerQueryParams): Promise<BorrowCollateralBorrower> {
  return mantle<BorrowCollateralBorrowerWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?borrow--collateral-borrower`,
    variables: {},
    ...params,
  });
}
