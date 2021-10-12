import { HumanAddr, moneyMarket, u, UST } from '@anchor-protocol/types';
import {
  hiveFetch,
  HiveQueryClient,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';

interface MarketStateWasmQuery {
  marketState: WasmQuery<
    moneyMarket.market.State,
    moneyMarket.market.StateResponse
  >;
}

export interface MarketStateQueryVariables {
  marketContract: string;
}

interface MarketStateQueryResult {
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

export async function marketStateQuery(
  marketContract: HumanAddr,
  hiveQueryClient: HiveQueryClient,
): Promise<MarketState> {
  const { marketState, marketBalances: _marketBalances } = await hiveFetch<
    MarketStateWasmQuery,
    MarketStateQueryVariables,
    MarketStateQueryResult
  >({
    ...hiveQueryClient,
    id: `market--state`,
    wasmQuery: {
      marketState: {
        contractAddress: marketContract,
        query: {
          state: {},
        },
      },
    },
    variables: {
      marketContract: marketContract,
    },
    query: MARKET_STATE_QUERY,
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
