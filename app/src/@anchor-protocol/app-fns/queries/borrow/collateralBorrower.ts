import { HumanAddr, moneyMarket } from '@anchor-protocol/types';
import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';

interface BorrowCollateralBorrowerWasmQuery {
  custodyBorrower: WasmQuery<
    moneyMarket.custody.Borrower,
    moneyMarket.custody.BorrowerResponse
  >;
}

export type BorrowCollateralBorrower =
  WasmQueryData<BorrowCollateralBorrowerWasmQuery>;

export async function borrowCollateralBorrowerQuery(
  walletAddr: HumanAddr | undefined,
  custodyContract: HumanAddr,
  queryClient: QueryClient,
): Promise<BorrowCollateralBorrower | undefined> {
  if (!walletAddr) {
    return undefined;
  }

  return wasmFetch<BorrowCollateralBorrowerWasmQuery>({
    ...queryClient,
    id: `borrow--collateral-borrower`,
    wasmQuery: {
      custodyBorrower: {
        contractAddress: custodyContract,
        query: {
          borrower: {
            address: walletAddr,
          },
        },
      },
    },
  });
}
