import {
  HumanAddr,
  moneyMarket,
  WASMContractResult,
} from '@anchor-protocol/types';
import { MantleFetch } from '@terra-money/webapp-fns';

export interface MarketStableCoinRawData {
  borrowRate: WASMContractResult;
  epochState: WASMContractResult;
}

export interface MarketStableCoinData {
  borrowRate: moneyMarket.interestModel.BorrowRateResponse;
  epochState: moneyMarket.overseer.EpochStateResponse;
}

export interface MarketStableCoinRawVariables {
  interestContract: string;
  borrowRateQuery: string;
  overseerContract: string;
  epochStateQuery: string;
}

export interface MarketStableCoinVariables {
  interestContract: HumanAddr;
  borrowRateQuery: moneyMarket.interestModel.BorrowRate;
  overseerContract: HumanAddr;
  epochStateQuery: moneyMarket.overseer.EpochState;
}

// language=graphql
export const MARKET_STABLE_COIN_QUERY = `
  query (
    $interestContract: String!
    $borrowRateQuery: String!
    $overseerContract: String!
    $epochStateQuery: String!
  ) {
    borrowRate: WasmContractsContractAddressStore(
      ContractAddress: $interestContract
      QueryMsg: $borrowRateQuery
    ) {
      Result
    }
    epochState: WasmContractsContractAddressStore(
      ContractAddress: $overseerContract
      QueryMsg: $epochStateQuery
    ) {
      Result
    }
  }
`;

export interface MarketStableCoinQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  variables: MarketStableCoinVariables;
}

export async function marketStableCoinQuery({
  mantleEndpoint,
  mantleFetch,
  variables,
}: MarketStableCoinQueryParams): Promise<MarketStableCoinData> {
  const rawData = await mantleFetch<
    MarketStableCoinRawVariables,
    MarketStableCoinRawData
  >(
    MARKET_STABLE_COIN_QUERY,
    {
      interestContract: variables.interestContract,
      borrowRateQuery: JSON.stringify(variables.borrowRateQuery),
      overseerContract: variables.overseerContract,
      epochStateQuery: JSON.stringify(variables.epochStateQuery),
    },
    `${mantleEndpoint}?market--stable-coin`,
  );

  const result: MarketStableCoinData = {
    borrowRate: JSON.parse(rawData.borrowRate.Result),
    epochState: JSON.parse(rawData.epochState.Result),
  };

  return result;
}
