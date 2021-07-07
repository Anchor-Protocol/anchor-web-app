import { CW20Addr, moneyMarket, Rate, uUST } from '@anchor-protocol/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@terra-money/webapp-fns';
import big from 'big.js';
import { ANCHOR_RATIO } from '../../env';

type BAssetLtvs = Map<
  CW20Addr,
  {
    max: Rate;
    safe: Rate;
  }
>;

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
  //bLunaOraclePrice: WasmQuery<
  //  moneyMarket.oracle.Price,
  //  moneyMarket.oracle.PriceResponse
  //>;
  //bEthOraclePrice: WasmQuery<
  //  moneyMarket.oracle.Price,
  //  moneyMarket.oracle.PriceResponse
  //>;
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
    uUST: uUST;
  };

  bAssetLtvs: BAssetLtvs;

  //bLunaMaxLtv?: Rate;
  //bLunaSafeLtv?: Rate;
  //
  //bEthMaxLtv?: Rate;
  //bEthSafeLtv?: Rate;
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
>;

export async function borrowMarketQuery({
  mantleEndpoint,
  wasmQuery,
  ...params
}: BorrowMarketQueryParams): Promise<BorrowMarket> {
  type MarketStateWasmQuery = Pick<BorrowMarketWasmQuery, 'marketState'>;
  type MarketWasmQuery = Omit<BorrowMarketWasmQuery, 'marketState'>;

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
        ?.Amount ?? '0') as uUST,
    };

  const { borrowRate, oraclePrices, overseerWhitelist } =
    await mantle<MarketWasmQuery>({
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
        //bLunaOraclePrice: wasmQuery.bLunaOraclePrice,
        //bEthOraclePrice: wasmQuery.bEthOraclePrice,
        overseerWhitelist: wasmQuery.overseerWhitelist,
      },
      ...params,
    });

  const whitelistIndex: Map<
    string,
    moneyMarket.overseer.WhitelistResponse['elems'][number]
  > = new Map();

  for (const elem of overseerWhitelist.elems) {
    whitelistIndex.set(elem.collateral_token, elem);
  }

  const bAssetLtvs: BAssetLtvs = new Map();

  for (const price of oraclePrices.prices) {
    const max = whitelistIndex.has(price.asset)
      ? whitelistIndex.get(price.asset)?.max_ltv ?? ('0.7' as Rate)
      : ('0.7' as Rate);

    const safe = big(max).mul(ANCHOR_RATIO).toFixed() as Rate;

    if (max && safe) {
      bAssetLtvs.set(price.asset, { max, safe });
    }
  }

  //const bLunaMaxLtv = overseerWhitelist.elems.find(
  //  ({ collateral_token }) =>
  //    collateral_token === wasmQuery.bLunaOraclePrice.query.price.base,
  //)?.max_ltv;
  //
  //const bLunaSafeLtv = bLunaMaxLtv
  //  ? (big(bLunaMaxLtv).mul(ANCHOR_RATIO).toFixed() as Rate)
  //  : undefined;
  //
  //const bEthMaxLtv = overseerWhitelist.elems.find(
  //  ({ collateral_token }) =>
  //    collateral_token === wasmQuery.bEthOraclePrice.query.price.base,
  //)?.max_ltv;
  //
  //const bEthSafeLtv = bEthMaxLtv
  //  ? (big(bEthMaxLtv).mul(ANCHOR_RATIO).toFixed() as Rate)
  //  : undefined;

  return {
    marketBalances,
    marketState,
    overseerWhitelist,
    oraclePrices,
    //bLunaOraclePrice,
    //bEthOraclePrice,
    borrowRate,
    bAssetLtvs,
    //bLunaMaxLtv,
    //bLunaSafeLtv,
    //bEthMaxLtv,
    //bEthSafeLtv,
  };
}
