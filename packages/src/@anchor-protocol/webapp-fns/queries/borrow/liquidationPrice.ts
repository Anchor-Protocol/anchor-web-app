import {
  HumanAddr,
  moneyMarket,
  UST,
  WASMContractResult,
} from '@anchor-protocol/types';
import { MantleFetch } from '@terra-money/webapp-fns';
import big from 'big.js';

export interface BorrowLiquidationPriceRawData {
  marketBorrowerInfo: WASMContractResult;
  overseerBorrowLimit: WASMContractResult;
  overseerCollaterals: WASMContractResult;
  overseerWhitelist: WASMContractResult;
  oraclePriceInfo: WASMContractResult;
}

export interface BorrowLiquidationPriceData {
  marketBorrowerInfo: moneyMarket.market.BorrowerInfoResponse;
  overseerBorrowLimit: moneyMarket.overseer.BorrowLimitResponse;
  overseerCollaterals: moneyMarket.overseer.CollateralsResponse;
  overseerWhitelist: moneyMarket.overseer.WhitelistResponse;
  oraclePriceInfo: moneyMarket.oracle.PriceResponse;

  liquidationPrice?: UST;
}

export interface BorrowLiquidationPriceRawVariables {
  marketContract: string;
  marketBorrowerInfoQuery: string;
  overseerContract: string;
  overseerBorrowlimitQuery: string;
  overseerCollateralsQuery: string;
  overseerWhitelistQuery: string;
  oracleContract: string;
  oraclePriceQuery: string;
}

export interface BorrowLiquidationPriceVariables {
  marketContract: HumanAddr;
  marketBorrowerInfoQuery: moneyMarket.market.BorrowerInfo;
  overseerContract: HumanAddr;
  overseerBorrowlimitQuery: moneyMarket.overseer.BorrowLimit;
  overseerCollateralsQuery: moneyMarket.overseer.Collaterals;
  overseerWhitelistQuery: moneyMarket.overseer.Whitelist;
  oracleContract: HumanAddr;
  oraclePriceQuery: moneyMarket.oracle.Price;
}

// language=graphql
export const BORROW_LIQUIDATION_PRICE_QUERY = `
  query (
    $marketContract: String!
    $marketBorrowerInfoQuery: String!
    $overseerContract: String!
    $overseerBorrowlimitQuery: String!
    $overseerCollateralsQuery: String!
    $overseerWhitelistQuery: String!
    $oracleContract: String!
    $oraclePriceQuery: String!
  ) {
    marketBorrowerInfo: WasmContractsContractAddressStore(
      ContractAddress: $marketContract
      QueryMsg: $marketBorrowerInfoQuery
    ) {
      Result
    }

    overseerBorrowLimit: WasmContractsContractAddressStore(
      ContractAddress: $overseerContract
      QueryMsg: $overseerBorrowlimitQuery
    ) {
      Result
    }

    overseerCollaterals: WasmContractsContractAddressStore(
      ContractAddress: $overseerContract
      QueryMsg: $overseerCollateralsQuery
    ) {
      Result
    }

    overseerWhitelist: WasmContractsContractAddressStore(
      ContractAddress: $overseerContract
      QueryMsg: $overseerWhitelistQuery
    ) {
      Result
    }

    oraclePriceInfo: WasmContractsContractAddressStore(
      ContractAddress: $oracleContract
      QueryMsg: $oraclePriceQuery
    ) {
      Result
    }
  }
`;

export interface BorrowLiquidationPriceQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  variables: BorrowLiquidationPriceVariables;
  lastSyncedHeight: () => Promise<number>;
}

export async function borrowLiquidationPriceQuery({
  mantleEndpoint,
  mantleFetch,
  lastSyncedHeight,
  variables,
}: BorrowLiquidationPriceQueryParams): Promise<BorrowLiquidationPriceData> {
  const blockHeight = await lastSyncedHeight();

  variables.marketBorrowerInfoQuery.borrower_info.block_height =
    blockHeight + 1;
  variables.overseerBorrowlimitQuery.borrow_limit.block_time = blockHeight + 1;

  const rawData = await mantleFetch<
    BorrowLiquidationPriceRawVariables,
    BorrowLiquidationPriceRawData
  >(
    BORROW_LIQUIDATION_PRICE_QUERY,
    {
      marketContract: variables.marketContract,
      marketBorrowerInfoQuery: JSON.stringify(
        variables.marketBorrowerInfoQuery,
      ),
      overseerContract: variables.overseerContract,
      overseerBorrowlimitQuery: JSON.stringify(
        variables.overseerBorrowlimitQuery,
      ),
      overseerCollateralsQuery: JSON.stringify(
        variables.overseerCollateralsQuery,
      ),
      overseerWhitelistQuery: JSON.stringify(variables.overseerWhitelistQuery),
      oracleContract: variables.oracleContract,
      oraclePriceQuery: JSON.stringify(variables.oraclePriceQuery),
    },
    `${mantleEndpoint}?borrow--liquidation-price`,
  );

  const data: Omit<BorrowLiquidationPriceData, 'liquidationPrice'> = {
    marketBorrowerInfo: JSON.parse(rawData.marketBorrowerInfo.Result),
    overseerBorrowLimit: JSON.parse(rawData.overseerBorrowLimit.Result),
    overseerCollaterals: JSON.parse(rawData.overseerCollaterals.Result),
    overseerWhitelist: JSON.parse(rawData.overseerWhitelist.Result),
    oraclePriceInfo: JSON.parse(rawData.oraclePriceInfo.Result),
  };

  if (data.overseerCollaterals.collaterals.length === 0) {
    return data;
  }

  const bLunaContractAddress =
    variables.overseerWhitelistQuery.whitelist.collateral_token;

  const bLunaCollateral = data.overseerCollaterals.collaterals.find(
    ([contractAddress]) => contractAddress === bLunaContractAddress,
  );

  const bLunaWhitelist = data.overseerWhitelist.elems.find(
    ({ collateral_token }) => collateral_token === bLunaContractAddress,
  );

  if (!bLunaCollateral || !bLunaWhitelist) {
    return data;
  }

  return {
    ...data,
    liquidationPrice: big(data.marketBorrowerInfo.loan_amount)
      .div(big(bLunaCollateral[1]).mul(bLunaWhitelist.max_ltv))
      .toFixed() as UST,
  };
}
