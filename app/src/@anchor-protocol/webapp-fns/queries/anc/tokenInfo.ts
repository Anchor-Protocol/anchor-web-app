import { ANC, cw20, CW20Addr } from '@anchor-protocol/types';
import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';

interface AncTokenInfoWasmQuery {
  ancTokenInfo: WasmQuery<cw20.TokenInfo, cw20.TokenInfoResponse<ANC>>;
}

export type AncTokenInfo = WasmQueryData<AncTokenInfoWasmQuery>;

/** @deprecated */
export async function ancTokenInfoQuery(
  ancTokenAddr: CW20Addr,
  queryClient: QueryClient,
): Promise<AncTokenInfo> {
  return wasmFetch<AncTokenInfoWasmQuery>({
    ...queryClient,
    id: `anc--token-info`,
    wasmQuery: {
      ancTokenInfo: {
        contractAddress: ancTokenAddr,
        query: {
          token_info: {},
        },
      },
    },
  });
}
