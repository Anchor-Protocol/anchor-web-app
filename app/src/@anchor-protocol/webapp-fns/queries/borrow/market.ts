import {
  CW20Addr,
  HumanAddr,
  moneyMarket,
  NativeDenom,
  Rate,
  terraswap,
  u,
  UST,
} from '@anchor-protocol/types';
import { mantle, MantleParams, WasmQuery, WasmQueryData } from '@libs/mantle';
import { terraswapPoolQuery } from '@libs/webapp-fns';
import big from 'big.js';
import { ANCHOR_SAFE_RATIO } from '../../env';

export type BAssetLtv = {
  max: Rate;
  safe: Rate;
};

export type BAssetLtvs = Map<CW20Addr, BAssetLtv>;

export interface BorrowMarketWasmQuery {
  marketState: WasmQuery<
    moneyMarket.market.State,
    moneyMarket.market.StateResponse
  >;
  borrowRate: WasmQuery<
    moneyMarket.interestModel.BorrowRate,
    moneyMarket.interestModel.BorrowRateResponse
  >;
  oraclePrices: WasmQuery<
    moneyMarket.oracle.Prices,
    moneyMarket.oracle.PricesResponse
  >;
  overseerWhitelist: WasmQuery<
    moneyMarket.overseer.Whitelist,
    moneyMarket.overseer.WhitelistResponse
  >;
}

export interface BorrowMarketStateQueryVariables {
  marketContract: string;
}

export interface BorrowMarketStateQueryResult {
  marketBalances: {
    Result: { Denom: string; Amount: string }[];
  };
}

export type BorrowMarket = WasmQueryData<BorrowMarketWasmQuery> & {
  marketBalances: {
    uUST: u<UST>;
  };

  bAssetLtvs: BAssetLtvs;
  bAssetLtvsSum: BAssetLtv;
  bAssetLtvsAvg: BAssetLtv;
};

// language=graphql
export const BORROW_MARKET_STATE_QUERY = `
  query (
    $marketContract: String!
  ) {
    marketBalances: BankBalancesAddress(Address: $marketContract) {
      Result {
        Denom
        Amount
      }
    }
  }
`;

export type BorrowMarketQueryParams = Omit<
  MantleParams<BorrowMarketWasmQuery>,
  'query' | 'variables'
> & {
  terraswapFactoryAddr: HumanAddr;
  bEthTokenAddr: CW20Addr;
  bLunaTokenAddr: CW20Addr;
  useExternalOraclePrice: boolean;
};

type MarketStateWasmQuery = Pick<BorrowMarketWasmQuery, 'marketState'>;
type MarketWasmQuery = Omit<BorrowMarketWasmQuery, 'marketState'>;

export async function borrowMarketQuery({
  mantleEndpoint,
  wasmQuery,
  //collateralVector,
  bLunaTokenAddr,
  bEthTokenAddr,
  terraswapFactoryAddr,
  useExternalOraclePrice,
  ...params
}: BorrowMarketQueryParams): Promise<BorrowMarket> {
  const { marketBalances: _marketBalances, marketState } = await mantle<
    MarketStateWasmQuery,
    BorrowMarketStateQueryVariables,
    BorrowMarketStateQueryResult
  >({
    mantleEndpoint: `${mantleEndpoint}?borrow--market-state`,
    wasmQuery: {
      marketState: wasmQuery.marketState,
    },
    variables: {
      marketContract: wasmQuery.marketState.contractAddress,
    },
    query: BORROW_MARKET_STATE_QUERY,
    ...params,
  });

  const marketBalances: Pick<BorrowMarket, 'marketBalances'>['marketBalances'] =
    {
      uUST: (_marketBalances.Result.find(({ Denom }) => Denom === 'uusd')
        ?.Amount ?? '0') as u<UST>,
    };

  //const {
  //  borrowRate,
  //  oraclePrices: _oraclePrices,
  //  overseerWhitelist,
  //} = await borrowMarket({
  //  mantleEndpoint,
  //  wasmQuery,
  //  marketBalances,
  //  marketState,
  //  ...params,
  //});

  const {
    borrowRate,
    oraclePrices: _oraclePrices,
    overseerWhitelist,
  } = useExternalOraclePrice
    ? await borrowMarketWithoutOraclePrices({
        mantleEndpoint,
        wasmQuery,
        marketBalances,
        marketState,
        bLunaTokenAddr,
        bEthTokenAddr,
        terraswapFactoryAddr,
        useExternalOraclePrice,
        ...params,
      })
    : await borrowMarket({
        mantleEndpoint,
        wasmQuery,
        marketBalances,
        marketState,
        bLunaTokenAddr,
        bEthTokenAddr,
        terraswapFactoryAddr,
        useExternalOraclePrice,
        ...params,
      });

  //const {
  //  borrowRate,
  //  oraclePrices: _oraclePrices,
  //  overseerWhitelist,
  //} = await mantle<MarketWasmQuery>({
  //  mantleEndpoint: `${mantleEndpoint}?borrow--market`,
  //  variables: {},
  //  wasmQuery: {
  //    borrowRate: {
  //      ...wasmQuery.borrowRate,
  //      query: {
  //        borrow_rate: {
  //          market_balance: marketBalances.uUST,
  //          total_liabilities: marketState.total_liabilities,
  //          total_reserves: marketState.total_reserves,
  //        },
  //      },
  //    },
  //    oraclePrices: wasmQuery.oraclePrices,
  //    overseerWhitelist: wasmQuery.overseerWhitelist,
  //  },
  //  ...params,
  //});

  const whitelistIndex: Map<
    string,
    moneyMarket.overseer.WhitelistResponse['elems'][number]
  > = new Map();

  for (const elem of overseerWhitelist.elems) {
    whitelistIndex.set(elem.collateral_token, elem);
  }

  const bAssetLtvs: BAssetLtvs = new Map();

  const oraclePrices: moneyMarket.oracle.PricesResponse =
    //@ts-ignore
    'Ok' in _oraclePrices ? _oraclePrices.Ok : _oraclePrices;

  for (const price of oraclePrices.prices) {
    const max = whitelistIndex.has(price.asset)
      ? whitelistIndex.get(price.asset)?.max_ltv ?? ('0.5' as Rate)
      : ('0.5' as Rate);

    const safe = big(max).mul(ANCHOR_SAFE_RATIO).toFixed() as Rate;

    if (max && safe) {
      bAssetLtvs.set(price.asset, { max, safe });
    }
  }

  const bAssetLtvsSum = Array.from(bAssetLtvs).reduce(
    (total, [, { max, safe }]) => {
      return {
        max: big(total.max).plus(max).toFixed() as Rate,
        safe: big(total.safe).plus(safe).toFixed() as Rate,
      };
    },
    { max: '0' as Rate, safe: '0' as Rate },
  );

  const bAssetLtvsAvg = {
    max: big(bAssetLtvsSum.max).div(bAssetLtvs.size).toFixed() as Rate,
    safe: big(bAssetLtvsSum.safe).div(bAssetLtvs.size).toFixed() as Rate,
  };

  return {
    marketBalances,
    marketState,
    overseerWhitelist,
    oraclePrices,
    //bLunaOraclePrice,
    //bEthOraclePrice,
    borrowRate,
    bAssetLtvs,
    bAssetLtvsSum,
    bAssetLtvsAvg,
    //bLunaMaxLtv,
    //bLunaSafeLtv,
    //bEthMaxLtv,
    //bEthSafeLtv,
  };
}

/* eslint-disable @typescript-eslint/no-unused-vars */

function borrowMarket({
  mantleEndpoint,
  wasmQuery,
  marketBalances,
  marketState,
  ...params
}: BorrowMarketQueryParams & {
  marketBalances: Pick<BorrowMarket, 'marketBalances'>['marketBalances'];
  marketState: moneyMarket.market.StateResponse;
}): Promise<WasmQueryData<MarketWasmQuery>> {
  return mantle<MarketWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?borrow--market`,
    variables: {},
    wasmQuery: {
      borrowRate: {
        ...wasmQuery.borrowRate,
        query: {
          borrow_rate: {
            market_balance: marketBalances.uUST,
            total_liabilities: marketState.total_liabilities,
            total_reserves: marketState.total_reserves,
          },
        },
      },
      oraclePrices: wasmQuery.oraclePrices,
      overseerWhitelist: wasmQuery.overseerWhitelist,
    },
    ...params,
  });
}

interface LunaUstPairQuery {
  lunaPair: WasmQuery<terraswap.factory.Pair, terraswap.factory.PairResponse>;
}

async function borrowMarketWithoutOraclePrices({
  mantleEndpoint,
  wasmQuery,
  marketBalances,
  marketState,
  terraswapFactoryAddr,
  bLunaTokenAddr,
  bEthTokenAddr,
  ...params
}: BorrowMarketQueryParams & {
  marketBalances: Pick<BorrowMarket, 'marketBalances'>['marketBalances'];
  marketState: moneyMarket.market.StateResponse;
  terraswapFactoryAddr: HumanAddr;
  bEthTokenAddr: CW20Addr;
  bLunaTokenAddr: CW20Addr;
}): Promise<WasmQueryData<MarketWasmQuery>> {
  type WithoutOraclePrices = Omit<MarketWasmQuery, 'oraclePrices'>;

  const cryptocompareApiKey = process.env.VITE_CRYPTOCOMPARE
    ? `&api_key=${process.env.VITE_CRYPTOCOMPARE}`
    : '';

  const ethPrice = await fetch(
    `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD${cryptocompareApiKey}`,
  ).then((res) => res.json() as Promise<{ USD: number }>);

  const { lunaPair } = await mantle<LunaUstPairQuery>({
    mantleEndpoint,
    variables: {},
    wasmQuery: {
      lunaPair: {
        contractAddress: terraswapFactoryAddr,
        query: {
          pair: {
            asset_infos: [
              {
                native_token: {
                  denom: 'uluna' as NativeDenom,
                },
              },
              {
                native_token: {
                  denom: 'uusd' as NativeDenom,
                },
              },
            ],
          },
        },
      },
    },
  });

  const { terraswapPoolInfo } = await terraswapPoolQuery(
    lunaPair.contract_addr,
    mantleEndpoint,
  );

  const { borrowRate, overseerWhitelist } = await mantle<WithoutOraclePrices>({
    mantleEndpoint: `${mantleEndpoint}?borrow--market`,
    variables: {},
    wasmQuery: {
      borrowRate: {
        ...wasmQuery.borrowRate,
        query: {
          borrow_rate: {
            market_balance: marketBalances.uUST,
            total_liabilities: marketState.total_liabilities,
            total_reserves: marketState.total_reserves,
          },
        },
      },
      //oraclePrices: wasmQuery.oraclePrices,
      overseerWhitelist: wasmQuery.overseerWhitelist,
    },
    ...params,
  });

  return {
    borrowRate,
    overseerWhitelist,
    oraclePrices: {
      prices: [
        {
          asset: bEthTokenAddr,
          price: ethPrice.USD.toString() as UST,
          last_updated_time: Date.now() / 1000,
        },
        {
          asset: bLunaTokenAddr,
          price: terraswapPoolInfo.tokenPrice,
          last_updated_time: Date.now() / 1000,
        },
      ],
    },
  };
}
