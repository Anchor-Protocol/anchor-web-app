import { HumanAddr } from '@anchor-protocol/types';
import {
  borrowBorrowerQuery,
  borrowMarketQuery,
  computeBorrowedAmount,
  computeBorrowLimit,
  computeLtv,
} from '@anchor-protocol/app-fns';
import { AnchorContractAddress } from '@anchor-protocol/app-provider';
import { lastSyncedHeightQuery } from '@libs/app-fns';
import { HiveQueryClient } from '@libs/query-client';

interface UserLtvQueryParams {
  walletAddress: HumanAddr;
  address: AnchorContractAddress;
  hiveQueryClient: HiveQueryClient;
}

export async function userLtvQuery({
  walletAddress,
  address,
  hiveQueryClient,
}: UserLtvQueryParams) {
  const [{ oraclePrices, bAssetLtvs }, borrowerResult] = await Promise.all([
    borrowMarketQuery(
      address.moneyMarket.market,
      address.moneyMarket.interestModel,
      address.moneyMarket.oracle,
      address.moneyMarket.overseer,
      hiveQueryClient,
    ),
    borrowBorrowerQuery(
      walletAddress,
      () => lastSyncedHeightQuery(hiveQueryClient),
      address.moneyMarket.market,
      address.moneyMarket.overseer,
      hiveQueryClient,
    ),
  ]);

  if (!borrowerResult) {
    throw new Error(`Can't get result borrowBorrowerQuery()`);
  }

  const { marketBorrowerInfo, overseerCollaterals } = borrowerResult;

  const borrowLimit = computeBorrowLimit(
    overseerCollaterals,
    oraclePrices,
    bAssetLtvs,
  );

  const borrowAmount = computeBorrowedAmount(marketBorrowerInfo);

  return computeLtv(borrowLimit, borrowAmount);
}
