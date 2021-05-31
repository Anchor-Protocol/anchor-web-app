import {
  cw20,
  CW20Addr,
  HumanAddr,
  moneyMarket,
  ubLuna,
  WASMContractResult,
} from '@anchor-protocol/types';
import { MantleFetch } from '@terra-money/webapp-fns';

export interface MarketBAssetRawData {
  bLunaBalance: WASMContractResult;
  oraclePrice: WASMContractResult;
}

export interface MarketBAssetData {
  bLunaBalance: cw20.BalanceResponse<ubLuna>;
  oraclePrice: moneyMarket.oracle.PriceResponse;
}

export interface MarketBAssetRawVariables {
  bLunaContract: string;
  bLunaBalanceQuery: string;
  oracleContract: string;
  oraclePriceQuery: string;
}

export interface MarketBAssetVariables {
  bLunaContract: CW20Addr;
  bLunaBalanceQuery: cw20.Balance;
  oracleContract: HumanAddr;
  oraclePriceQuery: moneyMarket.oracle.Price;
}

// language=graphql
export const MARKET_BASSET_QUERY = `
  query (
    $bLunaContract: String!
    $bLunaBalanceQuery: String!
    $oracleContract: String!
    $oraclePriceQuery: String!
  ) {
    bLunaBalance: WasmContractsContractAddressStore(
      ContractAddress: $bLunaContract
      QueryMsg: $bLunaBalanceQuery
    ) {
      Result
    }
    oraclePrice: WasmContractsContractAddressStore(
      ContractAddress: $oracleContract
      QueryMsg: $oraclePriceQuery
    ) {
      Result
    }
  }
`;

export interface MarketBAssetQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  variables: MarketBAssetVariables;
}

export async function marketBAssetQuery({
  mantleEndpoint,
  mantleFetch,
  variables,
}: MarketBAssetQueryParams): Promise<MarketBAssetData> {
  const rawData = await mantleFetch<
    MarketBAssetRawVariables,
    MarketBAssetRawData
  >(
    MARKET_BASSET_QUERY,
    {
      bLunaContract: variables.bLunaContract,
      bLunaBalanceQuery: JSON.stringify(variables.bLunaBalanceQuery),
      oracleContract: variables.oracleContract,
      oraclePriceQuery: JSON.stringify(variables.oraclePriceQuery),
    },
    `${mantleEndpoint}?market--basset`,
  );

  const result: MarketBAssetData = {
    bLunaBalance: JSON.parse(rawData.bLunaBalance.Result),
    oraclePrice: JSON.parse(rawData.oraclePrice.Result),
  };

  return result;
}
