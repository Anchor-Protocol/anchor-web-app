import { HumanAddr } from '@anchor-protocol/types';
import {
  borrowBorrowerQuery,
  borrowMarketQuery,
  computeCurrentLtv,
} from '@anchor-protocol/webapp-fns';
import { AnchorContractAddress } from '@anchor-protocol/webapp-provider';
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
  const [{ oraclePrices }, borrowerResult] = await Promise.all([
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

  return computeCurrentLtv(
    marketBorrowerInfo,
    overseerCollaterals,
    oraclePrices,
  );
}
