import { moneyMarket } from '@anchor-protocol/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@packages/webapp-fns';

export interface MarketStableCoinWasmQuery {
  borrowRate: WasmQuery<
    moneyMarket.interestModel.BorrowRate,
    moneyMarket.interestModel.BorrowRateResponse
  >;
  epochState: WasmQuery<
    moneyMarket.overseer.EpochState,
    moneyMarket.overseer.EpochStateResponse
  >;
}

export type MarketStableCoin = WasmQueryData<MarketStableCoinWasmQuery>;

export type MarketStableCoinQueryParams = Omit<
  MantleParams<MarketStableCoinWasmQuery>,
  'query' | 'variables'
>;

export async function marketStableCoinQuery({
  mantleEndpoint,
  ...params
}: MarketStableCoinQueryParams): Promise<MarketStableCoin> {
  return mantle<MarketStableCoinWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?market--stable-coin`,
    variables: {},
    ...params,
  });
}
