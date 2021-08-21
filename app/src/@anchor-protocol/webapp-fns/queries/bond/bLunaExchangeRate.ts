import { bluna } from '@anchor-protocol/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@packages/webapp-fns';

export interface BondBLunaExchangeRateWasmQuery {
  state: WasmQuery<bluna.hub.State, bluna.hub.StateResponse>;
  parameters: WasmQuery<bluna.hub.Parameters, bluna.hub.ParametersResponse>;
}

export type BondBLunaExchangeRate =
  WasmQueryData<BondBLunaExchangeRateWasmQuery>;

export type BondBLunaExchangeRateQueryParams = Omit<
  MantleParams<BondBLunaExchangeRateWasmQuery>,
  'query' | 'variables'
>;

export async function bondBLunaExchangeRateQuery({
  mantleEndpoint,
  wasmQuery,
  ...params
}: BondBLunaExchangeRateQueryParams): Promise<BondBLunaExchangeRate> {
  return mantle<BondBLunaExchangeRateWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?bond--bluna-exchange-rate`,
    variables: {},
    wasmQuery,
    ...params,
  });
}
