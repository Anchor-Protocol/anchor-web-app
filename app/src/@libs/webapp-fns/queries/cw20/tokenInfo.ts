import { cw20, CW20Addr, Token } from '@libs/types';
import {
  defaultMantleFetch,
  mantle,
  MantleFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/mantle';
import { cw20TokenInfoCache } from '../../caches/cw20TokenInfoCache';

interface CW20TokenInfoWasmQuery<T extends Token> {
  tokenInfo: WasmQuery<cw20.TokenInfo, cw20.TokenInfoResponse<T>>;
}

export type CW20TokenInfo<T extends Token> = WasmQueryData<
  CW20TokenInfoWasmQuery<T>
>;

export async function cw20TokenInfoQuery<T extends Token>(
  tokenAddr: CW20Addr,
  mantleEndpoint: string,
  mantleFetch: MantleFetch = defaultMantleFetch,
  requestInit?: RequestInit,
  ignoreCache: boolean = false,
): Promise<CW20TokenInfo<T>> {
  if (!ignoreCache && cw20TokenInfoCache.has(tokenAddr)) {
    return {
      tokenInfo: cw20TokenInfoCache.get(
        tokenAddr,
      )! as cw20.TokenInfoResponse<T>,
    };
  }

  const { tokenInfo } = await mantle<CW20TokenInfoWasmQuery<T>>({
    mantleEndpoint: `${mantleEndpoint}?cw20--token-info=${tokenAddr}`,
    mantleFetch,
    requestInit,
    variables: {},
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
