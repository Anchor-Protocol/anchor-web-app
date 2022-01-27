import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';
import { cw20, CW20Addr } from '@libs/types';
import { cw20MinterCache } from '../../caches/cw20MinterCache';

interface CW20MinterWasmQuery {
  minter: WasmQuery<cw20.Minter, cw20.MinterResponse>;
}

export type CW20Minter = WasmQueryData<CW20MinterWasmQuery>;

export async function cw20MinterQuery(
  tokenAddr: CW20Addr,
  queryClient: QueryClient,
  ignoreCache: boolean = false,
): Promise<CW20Minter> {
  if (!ignoreCache && cw20MinterCache.has(tokenAddr)) {
    return {
      minter: cw20MinterCache.get(tokenAddr)!,
    };
  }

  const { minter } = await wasmFetch<CW20MinterWasmQuery>({
    ...queryClient,
    id: `cw20--minter=${tokenAddr}`,
    wasmQuery: {
      minter: {
        contractAddress: tokenAddr,
        query: {
          minter: {},
        },
      },
    },
  });

  cw20MinterCache.set(tokenAddr, minter);

  return { minter };
}
