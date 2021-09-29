import { ANC, cw20, moneyMarket } from '@anchor-protocol/types';
import { mantle, MantleParams, WasmQuery, WasmQueryData } from '@libs/mantle';

export interface RewardsClaimableUstBorrowRewardsWasmQuery {
  borrowerInfo: WasmQuery<
    moneyMarket.market.BorrowerInfo,
    moneyMarket.market.BorrowerInfoResponse
  >;
  userANCBalance: WasmQuery<cw20.Balance, cw20.BalanceResponse<ANC>>;
  marketState: WasmQuery<
    moneyMarket.market.State,
    moneyMarket.market.StateResponse
  >;
}

export type RewardsClaimableUstBorrowRewards =
  WasmQueryData<RewardsClaimableUstBorrowRewardsWasmQuery>;

export type RewardsClaimableUstBorrowRewardsQueryParams = Omit<
  MantleParams<RewardsClaimableUstBorrowRewardsWasmQuery>,
  'query' | 'variables'
> & {
  lastSyncedHeight: () => Promise<number>;
};

export async function rewardsClaimableUstBorrowRewardsQuery({
  mantleEndpoint,
  wasmQuery,
  lastSyncedHeight,
  ...params
}: RewardsClaimableUstBorrowRewardsQueryParams): Promise<RewardsClaimableUstBorrowRewards> {
  const blockHeight = await lastSyncedHeight();

  wasmQuery.borrowerInfo.query.borrower_info.block_height = blockHeight + 1;

  return mantle<RewardsClaimableUstBorrowRewardsWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?rewards--claimable-ust-borrow-rewards`,
    variables: {},
    wasmQuery,
    ...params,
  });
}
