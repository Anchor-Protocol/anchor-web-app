import { moneyMarket, u, UST } from '@anchor-protocol/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@libs/webapp-fns';

export interface MarketStateWasmQuery {
  marketState: WasmQuery<
    moneyMarket.market.State,
    moneyMarket.market.StateResponse
  >;
}

export interface MarketStateQueryVariables {
  marketContract: string;
}

export interface MarketStateQueryResult {
  marketBalances: {
    Result: { Denom: string; Amount: string }[];
  };
}

export type MarketState = WasmQueryData<MarketStateWasmQuery> & {
  marketBalances: {
    uUST: u<UST>;
  };
};

// language=graphql
export const MARKET_STATE_QUERY = `
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

export type MarketStateQueryParams = Omit<
  MantleParams<MarketStateWasmQuery>,
  'query' | 'variables'
>;

export async function marketStateQuery({
  mantleEndpoint,
  wasmQuery,
  ...params
}: MarketStateQueryParams): Promise<MarketState> {
  const { marketState, marketBalances: _marketBalances } = await mantle<
    MarketStateWasmQuery,
    MarketStateQueryVariables,
    MarketStateQueryResult
  >({
    mantleEndpoint: `${mantleEndpoint}?market--state`,
    wasmQuery: {
      marketState: wasmQuery.marketState,
    },
    variables: {
      marketContract: wasmQuery.marketState.contractAddress,
    },
    query: MARKET_STATE_QUERY,
    ...params,
  });

  const marketBalances: Pick<MarketState, 'marketBalances'>['marketBalances'] =
    {
      uUST: (_marketBalances.Result.find(({ Denom }) => Denom === 'uusd')
        ?.Amount ?? '0') as u<UST>,
    };

  return {
    marketState,
    marketBalances,
  };
}
