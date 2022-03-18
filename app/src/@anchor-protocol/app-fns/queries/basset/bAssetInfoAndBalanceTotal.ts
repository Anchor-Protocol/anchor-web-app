import {
  CW20Addr,
  HumanAddr,
  moneyMarket,
  u,
  UST,
} from '@anchor-protocol/types';
import { QueryClient, wasmFetch, WasmQuery } from '@libs/query-client';
import big from 'big.js';
import {
  BAssetInfoAndBalance,
  bAssetInfoAndBalanceQuery,
} from './bAssetInfoAndBalance';

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

export interface BAssetInfoAndBalanceWithOracle extends BAssetInfoAndBalance {
  oraclePrice: moneyMarket.oracle.PricesResponse['prices'][number];
  ustValue: u<UST>;
}

export interface BAssetInfoAndBalancesTotal {
  infoAndBalances: BAssetInfoAndBalanceWithOracle[];
  totalUstValue: u<UST>;
}

export async function bAssetInfoAndBalanceTotalQuery(
  walletAddr: HumanAddr | undefined,
  overseerContract: HumanAddr,
  oracleContract: HumanAddr,
  queryClient: QueryClient,
): Promise<BAssetInfoAndBalancesTotal | undefined> {
  if (!walletAddr) {
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

  const oracleIndex = new Map<
    CW20Addr,
    moneyMarket.oracle.PricesResponse['prices'][number]
  >();

  for (const oraclePrice of oraclePrices.prices) {
    oracleIndex.set(oraclePrice.asset, oraclePrice);
  }

  const infoAndBalances = await Promise.all(
    whitelist.elems
      //.filter(({ symbol }) => symbol.toLowerCase() !== 'bluna')
      .map((el) => bAssetInfoAndBalanceQuery(walletAddr, el, queryClient)),
  ).then((list) => {
    return list
      .filter(
        (
          item: BAssetInfoAndBalance | undefined,
        ): item is BAssetInfoAndBalance => {
          return !!item && oracleIndex.has(item.bAsset.collateral_token);
        },
      )
      .map((item) => {
        const oraclePrice = oracleIndex.get(item.bAsset.collateral_token)!;
        return {
          ...item,
          oraclePrice,
          ustValue: big(item.balance.balance)
            .mul(oraclePrice.price)
            .toFixed() as u<UST>,
        } as BAssetInfoAndBalanceWithOracle;
      });
  });

  const ustTotal = infoAndBalances.reduce((t, { ustValue }) => {
    return t.plus(ustValue);
  }, big(0));

  return {
    infoAndBalances,
    totalUstValue: ustTotal.toFixed() as u<UST>,
  };
}
