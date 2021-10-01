import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';
import { lp, LPAddr } from '@libs/types';

interface LpMinterWasmQuery {
  minter: WasmQuery<lp.Minter, lp.MinterResponse>;
}

export type LpMinter = WasmQueryData<LpMinterWasmQuery>;

export async function lpMinterQuery(
  lpTokenAddr: LPAddr,
  queryClient: QueryClient,
): Promise<LpMinter> {
  return wasmFetch<LpMinterWasmQuery>({
    ...queryClient,
    id: `lp--minter=${lpTokenAddr}`,
    wasmQuery: {
      minter: {
        contractAddress: lpTokenAddr,
        query: {
          minter: {},
        },
      },
    },
  });
}
