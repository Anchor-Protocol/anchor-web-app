import { cw20, moneyMarket, ubLuna } from '@anchor-protocol/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@libs/webapp-fns';

export interface MarketBAssetWasmQuery {
  bLunaBalance: WasmQuery<cw20.Balance, cw20.BalanceResponse<ubLuna>>;
  oraclePrice: WasmQuery<
    moneyMarket.oracle.Price,
    moneyMarket.oracle.PriceResponse
  >;
}

export type MarketBAsset = WasmQueryData<MarketBAssetWasmQuery>;

export type MarketBAssetQueryParams = Omit<
  MantleParams<MarketBAssetWasmQuery>,
  'query' | 'variables'
>;

export async function marketBAssetQuery({
  mantleEndpoint,
  ...params
}: MarketBAssetQueryParams): Promise<MarketBAsset> {
  return mantle<MarketBAssetWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?market--basset`,
    variables: {},
    ...params,
  });
}
