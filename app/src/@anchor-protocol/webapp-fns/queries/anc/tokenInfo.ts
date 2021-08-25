import { ANC, cw20, CW20Addr } from '@anchor-protocol/types';
import {
  defaultMantleFetch,
  mantle,
  MantleFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/webapp-fns';

interface AncTokenInfoWasmQuery {
  ancTokenInfo: WasmQuery<cw20.TokenInfo, cw20.TokenInfoResponse<ANC>>;
}

export type AncTokenInfo = WasmQueryData<AncTokenInfoWasmQuery>;

export async function ancTokenInfoQuery(
  ancTokenAddr: CW20Addr,
  mantleEndpoint: string,
  mantleFetch: MantleFetch = defaultMantleFetch,
  requestInit?: RequestInit,
): Promise<AncTokenInfo> {
  return mantle<AncTokenInfoWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?anc--token-info`,
    mantleFetch,
    requestInit,
    variables: {},
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
