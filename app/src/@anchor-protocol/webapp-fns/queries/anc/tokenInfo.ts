import { cw20, uANC } from '@anchor-protocol/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@packages/webapp-fns';

export interface AncTokenInfoWasmQuery {
  ancTokenInfo: WasmQuery<cw20.TokenInfo, cw20.TokenInfoResponse<uANC>>;
}

export type AncTokenInfo = WasmQueryData<AncTokenInfoWasmQuery>;

export type AncTokenInfoQueryParams = Omit<
  MantleParams<AncTokenInfoWasmQuery>,
  'query' | 'variables'
>;

export async function ancTokenInfoQuery({
  mantleEndpoint,
  wasmQuery,
  ...params
}: AncTokenInfoQueryParams): Promise<AncTokenInfo> {
  return mantle<AncTokenInfoWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?anc--token-info`,
    variables: {},
    wasmQuery,
    ...params,
  });
}
