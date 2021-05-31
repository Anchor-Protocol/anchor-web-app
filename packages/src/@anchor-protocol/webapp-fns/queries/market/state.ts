import {
  HumanAddr,
  moneyMarket,
  uUST,
  WASMContractResult,
} from '@anchor-protocol/types';
import { MantleFetch } from '@terra-money/webapp-fns';

export interface MarketStateRawData {
  marketBalances: {
    Result: { Denom: string; Amount: string }[];
  };
  marketState: WASMContractResult;
}

export interface MarketStateData {
  marketBalances: {
    uUST: uUST;
  };
  marketState: moneyMarket.market.StateResponse;
}

export interface MarketStateRawVariables {
  marketContract: string;
  marketStateQuery: string;
}

export interface MarketStateVariables {
  marketContract: HumanAddr;
  marketStateQuery: moneyMarket.market.State;
}

// language=graphql
export const MARKET_STATE_QUERY = `
  query (
    $marketContract: String!
    $marketStateQuery: String!
  ) {
    marketBalances: BankBalancesAddress(Address: $marketContract) {
      Result {
        Denom
        Amount
      }
    }

    marketState: WasmContractsContractAddressStore(
      ContractAddress: $marketContract
      QueryMsg: $marketStateQuery
    ) {
      Result
    }
  }
`;

export interface MarketStateQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  variables: MarketStateVariables;
}

export async function marketStateQuery({
  mantleEndpoint,
  mantleFetch,
  variables,
}: MarketStateQueryParams): Promise<MarketStateData> {
  const rawData = await mantleFetch<
    MarketStateRawVariables,
    MarketStateRawData
  >(
    MARKET_STATE_QUERY,
    {
      marketContract: variables.marketContract,
      marketStateQuery: JSON.stringify(variables.marketStateQuery),
    },
    `${mantleEndpoint}?market--state`,
  );

  const result: MarketStateData = {
    marketBalances: {
      uUST: (rawData.marketBalances.Result.find(({ Denom }) => Denom === 'uusd')
        ?.Amount ?? '0') as uUST,
    },
    marketState: JSON.parse(rawData.marketState.Result),
  };

  return result;
}
