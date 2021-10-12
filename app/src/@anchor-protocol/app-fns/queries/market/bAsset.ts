import {
  bLuna,
  cw20,
  CW20Addr,
  HumanAddr,
  moneyMarket,
  NativeDenom,
} from '@anchor-protocol/types';
import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';

interface MarketBAssetWasmQuery {
  bLunaBalance: WasmQuery<cw20.Balance, cw20.BalanceResponse<bLuna>>;
  oraclePrice: WasmQuery<
    moneyMarket.oracle.Price,
    moneyMarket.oracle.PriceResponse
  >;
}

export type MarketBAsset = WasmQueryData<MarketBAssetWasmQuery>;

export async function marketBAssetQuery(
  bLunaContract: CW20Addr,
  oracleContract: HumanAddr,
  custodyContract: HumanAddr,
  queryClient: QueryClient,
): Promise<MarketBAsset> {
  return wasmFetch<MarketBAssetWasmQuery>({
    ...queryClient,
    id: `market--basset`,
    wasmQuery: {
      bLunaBalance: {
        contractAddress: bLunaContract,
        query: {
          balance: {
            address: custodyContract,
          },
        },
      },
      oraclePrice: {
        contractAddress: oracleContract,
        query: {
          price: {
            base: bLunaContract,
            quote: 'uusd' as NativeDenom,
          },
        },
      },
    },
  });
}
