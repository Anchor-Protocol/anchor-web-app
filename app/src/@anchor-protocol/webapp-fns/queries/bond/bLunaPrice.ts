import { bLuna, terraswap, uToken } from '@anchor-protocol/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@terra-money/webapp-fns';
import big from 'big.js';

export interface BondBLunaPriceWasmQuery {
  terraswapPool: WasmQuery<terraswap.Pool, terraswap.PoolResponse<uToken>>;
}

export type BondBLunaPrice = WasmQueryData<BondBLunaPriceWasmQuery> & {
  bLunaPrice: bLuna;
};

export type BondBLunaPriceQueryParams = Omit<
  MantleParams<BondBLunaPriceWasmQuery>,
  'query' | 'variables'
>;

export async function bondBLunaPriceQuery({
  mantleEndpoint,
  wasmQuery,
  ...params
}: BondBLunaPriceQueryParams): Promise<BondBLunaPrice> {
  const { terraswapPool } = await mantle<BondBLunaPriceWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?bond--bluna-price`,
    variables: {},
    wasmQuery,
    ...params,
  });

  return {
    terraswapPool,
    bLunaPrice: big(terraswapPool.assets[0].amount)
      .div(
        +terraswapPool.assets[1].amount === 0
          ? 1
          : terraswapPool.assets[1].amount,
      )
      .toFixed() as bLuna,
  };
}
