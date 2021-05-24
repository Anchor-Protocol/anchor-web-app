import {
  HumanAddr,
  moneyMarket,
  Rate,
  uUST,
  WASMContractResult,
} from '@anchor-protocol/types';
import { MantleFetch } from '@terra-money/webapp-fns';
import big from 'big.js';
import { ANCHOR_RATIO } from '../../env';

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
  marketState: moneyMarket.market.StateResponse;
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
  borrowRate: moneyMarket.interestModel.BorrowRateResponse;
  oraclePrice: moneyMarket.oracle.PriceResponse;
  overseerWhitelist: moneyMarket.overseer.WhitelistResponse;

  bLunaMaxLtv?: Rate;
  bLunaSafeLtv?: Rate;
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

  const data: Omit<BorrowMarketData, 'bLunaMaxLtv' | 'bLunaSafeLtv'> = {
    ...stateData,
    borrowRate: JSON.parse(rawData.borrowRate.Result),
    oraclePrice: JSON.parse(rawData.oraclePrice.Result),
    overseerWhitelist: JSON.parse(rawData.overseerWhitelist.Result),
  };

  const bLunaMaxLtv = data.overseerWhitelist.elems.find(
    ({ collateral_token }) =>
      collateral_token ===
      variables.overseerWhitelistQuery.whitelist.collateral_token,
  )?.max_ltv;

  const bLunaSafeLtv = bLunaMaxLtv
    ? (big(bLunaMaxLtv).mul(ANCHOR_RATIO).toFixed() as Rate)
    : undefined;

  return {
    ...data,
    bLunaMaxLtv,
    bLunaSafeLtv,
  };
}
