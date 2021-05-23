import {
  HumanAddr,
  moneyMarket,
  uUST,
  WASMContractResult,
} from '@anchor-protocol/types';
import { MantleFetch } from '@terra-money/webapp-fns';

export interface BorrowMarketStateRawData {
  marketBalances: {
    Result: { Denom: string; Amount: string }[];
  };
  marketState: WASMContractResult;
}

export interface BorrowMarketStateData {
  marketBalances: {
    uUST: uUST;
  };
  marketState: WASMContractResult<moneyMarket.market.StateResponse>;
}

export interface BorrowMarketStateRawVariables {
  marketContract: string;
  marketStateQuery: string;
}

export interface BorrowMarketRawData {
  borrowRate: WASMContractResult;
  oraclePrice: WASMContractResult;
  overseerWhitelist: WASMContractResult;
}

export interface BorrowMarketData extends BorrowMarketStateData {
  borrowRate: WASMContractResult<moneyMarket.interestModel.BorrowRateResponse>;
  oraclePrice: WASMContractResult<moneyMarket.oracle.PriceResponse>;
  overseerWhitelist: WASMContractResult<moneyMarket.overseer.WhitelistResponse>;
}

export interface BorrowMarketRawVariables {
  interestContract: string;
  interestBorrowRateQuery: string;
  oracleContract: string;
  oracleQuery: string;
  overseerContract: string;
  overseerWhitelistQuery: string;
}

export interface BorrowMarketVariables {
  marketContract: HumanAddr;
  interestContract: HumanAddr;
  oracleContract: HumanAddr;
  overseerContract: HumanAddr;
  marketStateQuery: moneyMarket.market.State;
  interestBorrowRateQuery: moneyMarket.interestModel.BorrowRate;
  oracleQuery: moneyMarket.oracle.Price;
  overseerWhitelistQuery: moneyMarket.overseer.Whitelist;
}

// language=graphql
export const BORROW_MARKET_STATE_QUERY = `
  query (
    $marketContract: String!
    $marketStateQuery: String!
  ) {
    marketBalance: BankBalancesAddress(Address: $marketContract) {
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

// language=graphql
export const BORROW_MARKET_QUERY = `
  query(
    $interestContract: String!
    $interestBorrowRateQuery: String!
    $oracleContract: String!
    $oracleQuery: String!
    $overseerContract: String!
    $overseerWhitelistQuery: String!
  ) {
    borrowRate: WasmContractsContractAddressStore(
      ContractAddress: $interestContract
      QueryMsg: $interestBorrowRateQuery
    ) {
      Result
    }

    oraclePrice: WasmContractsContractAddressStore(
      ContractAddress: $oracleContract
      QueryMsg: $oracleQuery
    ) {
      Result
    }

    overseerWhitelist: WasmContractsContractAddressStore(
      ContractAddress: $overseerContract
      QueryMsg: $overseerWhitelistQuery
    ) {
      Result
    }
  }
`;

export interface BorrowMarketQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  variables: BorrowMarketVariables;
}

export async function borrowMarketQuery({
  mantleEndpoint,
  mantleFetch,
  variables,
}: BorrowMarketQueryParams): Promise<BorrowMarketData> {
  const rawStateData = await mantleFetch<
    BorrowMarketStateRawVariables,
    BorrowMarketStateRawData
  >(
    BORROW_MARKET_STATE_QUERY,
    {
      marketContract: variables.marketContract,
      marketStateQuery: JSON.stringify(variables.marketStateQuery),
    },
    `${mantleEndpoint}?borrow--market-states`,
  );

  const stateData: BorrowMarketStateData = {
    marketBalances: {
      uUST: (rawStateData.marketBalances.Result.find(
        ({ Denom }) => Denom === 'uusd',
      )?.Amount ?? '0') as uUST,
    },
    marketState: JSON.parse(rawStateData.marketState.Result),
  };

  const rawData = await mantleFetch<
    BorrowMarketRawVariables,
    BorrowMarketRawData
  >(
    BORROW_MARKET_QUERY,
    {
      interestContract: variables.interestContract,
      interestBorrowRateQuery: JSON.stringify({
        borrow_rate: {
          market_balance: stateData.marketBalances.uUST,
          total_liabilities: stateData.marketState.total_liabilities,
          total_reserves: stateData.marketState.total_reserves,
        },
      } as moneyMarket.interestModel.BorrowRate),
      oracleContract: variables.oracleContract,
      oracleQuery: JSON.stringify(variables.oracleQuery),
      overseerContract: variables.overseerContract,
      overseerWhitelistQuery: JSON.stringify(variables.overseerWhitelistQuery),
    },
    `${mantleEndpoint}?borrow--market`,
  );

  return {
    ...stateData,
    borrowRate: JSON.parse(rawData.borrowRate.Result),
    oraclePrice: JSON.parse(rawData.oraclePrice.Result),
    overseerWhitelist: JSON.parse(rawData.overseerWhitelist.Result),
  };
}
