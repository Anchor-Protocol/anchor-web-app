import {
  CW20Addr,
  HumanAddr,
  moneyMarket,
  u,
  UST,
} from '@anchor-protocol/types';
import { QueryClient, wasmFetch, WasmQuery } from '@libs/query-client';
import big from 'big.js';
import { bAssetInfoAndBalanceQuery } from './bAssetInfoAndBalance';
import { BAssetInfoAndBalanceWithOracle } from './bAssetInfoAndBalanceTotal';

interface WhitelistWasmQuery {
  whitelist: WasmQuery<
    moneyMarket.overseer.Whitelist,
    moneyMarket.overseer.WhitelistResponse
  >;
  oraclePrices: WasmQuery<
    moneyMarket.oracle.Prices,
    moneyMarket.oracle.PricesResponse
  >;
}

export async function bAssetInfoAndBalanceByTokenAddrQuery(
  walletAddr: HumanAddr | undefined,
  tokenAddr: CW20Addr | undefined,
  overseerContract: HumanAddr,
  oracleContract: HumanAddr,
  queryClient: QueryClient,
): Promise<BAssetInfoAndBalanceWithOracle | undefined> {
  if (!walletAddr || !tokenAddr) {
    return undefined;
  }

  const { whitelist, oraclePrices } = await wasmFetch<WhitelistWasmQuery>({
    ...queryClient,
    id: 'basset--list',
    wasmQuery: {
      whitelist: {
        contractAddress: overseerContract,
        query: {
          whitelist: {},
        },
      },
      oraclePrices: {
        contractAddress: oracleContract,
        query: {
          prices: {},
        },
      },
    },
  });

  const bAsset = whitelist.elems.find(
    ({ collateral_token }) => collateral_token === tokenAddr,
  );

  if (!bAsset) {
    return undefined;
  }

  const oraclePrice = oraclePrices.prices.find(
    ({ asset }) => asset === tokenAddr,
  );

  if (!oraclePrice) {
    return undefined;
  }

  return bAssetInfoAndBalanceQuery(walletAddr, bAsset, queryClient).then(
    (item) => {
      if (!item) {
        return undefined;
      }

      return {
        ...item,
        oraclePrice,
        ustValue: big(item.balance.balance)
          .mul(oraclePrice.price)
          .toFixed() as u<UST>,
      } as BAssetInfoAndBalanceWithOracle;
    },
  );
}
