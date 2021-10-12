import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';
import { cw20, CW20Addr, Token } from '@libs/types';
import { cw20TokenInfoCache } from '../../caches/cw20TokenInfoCache';

interface CW20TokenInfoWasmQuery<T extends Token> {
  tokenInfo: WasmQuery<cw20.TokenInfo, cw20.TokenInfoResponse<T>>;
}

export type CW20TokenInfo<T extends Token> = WasmQueryData<
  CW20TokenInfoWasmQuery<T>
>;

export async function cw20TokenInfoQuery<T extends Token>(
  tokenAddr: CW20Addr,
  queryClient: QueryClient,
  ignoreCache: boolean = false,
): Promise<CW20TokenInfo<T>> {
  if (!ignoreCache && cw20TokenInfoCache.has(tokenAddr)) {
    return {
      tokenInfo: cw20TokenInfoCache.get(
        tokenAddr,
      )! as cw20.TokenInfoResponse<T>,
    };
  }

  const { tokenInfo } = await wasmFetch<CW20TokenInfoWasmQuery<T>>({
    ...queryClient,
    id: `cw20--token-info=${tokenAddr}`,
    wasmQuery: {
      tokenInfo: {
        contractAddress: tokenAddr,
        query: {
          token_info: {},
        },
      },
    },
  });

  cw20TokenInfoCache.set(tokenAddr, tokenInfo);

  return { tokenInfo };
}
