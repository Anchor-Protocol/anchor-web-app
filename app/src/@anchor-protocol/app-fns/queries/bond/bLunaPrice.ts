import { bLuna, HumanAddr, terraswap, Token } from '@anchor-protocol/types';
import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';
import big from 'big.js';

interface BondBLunaPriceWasmQuery {
  terraswapPool: WasmQuery<
    terraswap.pair.Pool,
    terraswap.pair.PoolResponse<Token, Token>
  >;
}

export type BondBLunaPrice = WasmQueryData<BondBLunaPriceWasmQuery> & {
  bLunaPrice: bLuna;
};

export async function bondBLunaPriceQuery(
  bLunaLunaPairContract: HumanAddr,
  queryClient: QueryClient,
): Promise<BondBLunaPrice> {
  const { terraswapPool } = await wasmFetch<BondBLunaPriceWasmQuery>({
    ...queryClient,
    id: `bond--bluna-price`,
    wasmQuery: {
      terraswapPool: {
        contractAddress: bLunaLunaPairContract,
        query: {
          pool: {},
        },
      },
    },
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
