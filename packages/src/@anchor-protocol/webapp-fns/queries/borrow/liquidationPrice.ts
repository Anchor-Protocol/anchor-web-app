import { moneyMarket, UST } from '@anchor-protocol/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@terra-money/webapp-fns';
import big from 'big.js';

export interface BorrowLiquidationPriceWasmQuery {
  marketBorrowerInfo: WasmQuery<
    moneyMarket.market.BorrowerInfo,
    moneyMarket.market.BorrowerInfoResponse
  >;
  overseerBorrowLimit: WasmQuery<
    moneyMarket.overseer.BorrowLimit,
    moneyMarket.overseer.BorrowLimitResponse
  >;
  overseerCollaterals: WasmQuery<
    moneyMarket.overseer.Collaterals,
    moneyMarket.overseer.CollateralsResponse
  >;
  overseerWhitelist: WasmQuery<
    moneyMarket.overseer.Whitelist,
    moneyMarket.overseer.WhitelistResponse
  >;
  oraclePriceInfo: WasmQuery<
    moneyMarket.oracle.Price,
    moneyMarket.oracle.PriceResponse
  >;
}

export type BorrowLiquidationPrice =
  WasmQueryData<BorrowLiquidationPriceWasmQuery> & {
    liquidationPrice?: UST;
  };

export type BorrowLiquidationPriceQueryParams = Omit<
  MantleParams<BorrowLiquidationPriceWasmQuery>,
  'query' | 'variables'
> & {
  lastSyncedHeight: () => Promise<number>;
};

export async function borrowLiquidationPriceQuery({
  mantleEndpoint,
  wasmQuery,
  lastSyncedHeight,
  ...params
}: BorrowLiquidationPriceQueryParams): Promise<BorrowLiquidationPrice> {
  const blockHeight = await lastSyncedHeight();

  wasmQuery.marketBorrowerInfo.query.borrower_info.block_height =
    blockHeight + 1;
  wasmQuery.overseerBorrowLimit.query.borrow_limit.block_time = blockHeight + 1;

  const data = await mantle<BorrowLiquidationPriceWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?borrow--liquidation-price&basset=${wasmQuery.oraclePriceInfo.query.price.base}`,
    variables: {},
    wasmQuery,
    ...params,
  });

  if (data.overseerCollaterals.collaterals.length === 0) {
    return data;
  }

  const bAssetContractAddress = wasmQuery.oraclePriceInfo.query.price.base;

  const bAssetCollateral = data.overseerCollaterals.collaterals.find(
    ([contractAddress]) => contractAddress === bAssetContractAddress,
  );

  const bAssetWhitelist = data.overseerWhitelist.elems.find(
    ({ collateral_token }) => collateral_token === bAssetContractAddress,
  );

  if (!bAssetCollateral || !bAssetWhitelist) {
    return data;
  }

  return {
    ...data,
    liquidationPrice: big(data.marketBorrowerInfo.loan_amount)
      .div(big(bAssetCollateral[1]).mul(bAssetWhitelist.max_ltv))
      .toFixed() as UST,
  };
}
