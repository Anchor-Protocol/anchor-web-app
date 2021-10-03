import {
  CW20Addr,
  HumanAddr,
  moneyMarket,
  Rate,
  u,
  UST,
} from '@anchor-protocol/types';
import {
  hiveFetch,
  HiveQueryClient,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';
import big from 'big.js';
import { ANCHOR_SAFE_RATIO } from '../../env';

export type BAssetLtv = {
  max: Rate;
  safe: Rate;
};

export type BAssetLtvs = Map<CW20Addr, BAssetLtv>;

interface BorrowMarketWasmQuery {
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

type MarketStateWasmQuery = Pick<BorrowMarketWasmQuery, 'marketState'>;
type MarketWasmQuery = Omit<BorrowMarketWasmQuery, 'marketState'>;

export async function borrowMarketQuery(
  marketContract: HumanAddr,
  interestContract: HumanAddr,
  oracleContract: HumanAddr,
  overseerContract: HumanAddr,
  hiveQueryClient: HiveQueryClient,
): Promise<BorrowMarket> {
  const { marketBalances: _marketBalances, marketState } = await hiveFetch<
    MarketStateWasmQuery,
    BorrowMarketStateQueryVariables,
    BorrowMarketStateQueryResult
  >({
    ...hiveQueryClient,
    id: `borrow--market-state`,
    wasmQuery: {
      marketState: {
        contractAddress: marketContract,
        query: {
          state: {},
        },
      },
    },
    variables: {
      marketContract,
    },
    query: BORROW_MARKET_STATE_QUERY,
  });

  const marketBalances: Pick<BorrowMarket, 'marketBalances'>['marketBalances'] =
    {
      uUST: (_marketBalances.Result.find(({ Denom }) => Denom === 'uusd')
        ?.Amount ?? '0') as u<UST>,
    };

  const {
    borrowRate,
    oraclePrices: _oraclePrices,
    overseerWhitelist,
  } = await hiveFetch<MarketWasmQuery>({
    ...hiveQueryClient,
    id: `borrow--market`,
    variables: {},
    wasmQuery: {
      borrowRate: {
        contractAddress: interestContract,
        query: {
          borrow_rate: {
            market_balance: marketBalances.uUST,
            total_liabilities: marketState.total_liabilities,
            total_reserves: marketState.total_reserves,
          },
        },
      },
      oraclePrices: {
        contractAddress: oracleContract,
        query: {
          prices: {},
        },
      },
      overseerWhitelist: {
        contractAddress: overseerContract,
        query: {
          whitelist: {},
        },
      },
    },
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
