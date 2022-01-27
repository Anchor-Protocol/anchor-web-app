import { bAsset, cw20, HumanAddr, moneyMarket } from '@anchor-protocol/types';
import { cw20BalanceQuery } from '@libs/app-fns';
import { QueryClient } from '@libs/query-client';

export interface BAssetInfoAndBalance {
  bAsset: moneyMarket.overseer.WhitelistResponse['elems'][number];
  balance: cw20.BalanceResponse<bAsset>;
}

export async function bAssetInfoAndBalanceQuery(
  walletAddr: HumanAddr | undefined,
  bAsset: moneyMarket.overseer.WhitelistResponse['elems'][number] | undefined,
  queryClient: QueryClient,
): Promise<BAssetInfoAndBalance | undefined> {
  if (!walletAddr || !bAsset) {
    return undefined;
  }

  const result = await cw20BalanceQuery<bAsset>(
    walletAddr,
    bAsset.collateral_token,
    queryClient,
  );

  if (!result) {
    return undefined;
  }

  return {
    bAsset,
    balance: result.tokenBalance,
  };
}
