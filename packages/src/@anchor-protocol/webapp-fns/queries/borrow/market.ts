import { CW20Addr, moneyMarket, Rate, uUST } from '@anchor-protocol/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@terra-money/webapp-fns';
import big from 'big.js';
import { ANCHOR_RATIO } from '../../env';

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
    uUST: uUST;
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

  const {
    borrowRate,
    oraclePrices: _oraclePrices,
    overseerWhitelist,
  } = await mantle<MarketWasmQuery>({
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

    const safe = big(max).mul(ANCHOR_RATIO).toFixed() as Rate;

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
