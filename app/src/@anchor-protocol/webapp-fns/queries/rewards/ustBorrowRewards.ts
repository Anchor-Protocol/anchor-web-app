import { moneyMarket } from '@anchor-protocol/types';
import { mantle, MantleParams, WasmQuery, WasmQueryData } from '@libs/mantle';

export interface RewardsUstBorrowRewardsWasmQuery {
  borrowerInfo: WasmQuery<
    moneyMarket.market.BorrowerInfo,
    moneyMarket.market.BorrowerInfoResponse
  >;
  marketState: WasmQuery<
    moneyMarket.market.State,
    moneyMarket.market.StateResponse
  >;
}

export type RewardsUstBorrowRewards =
  WasmQueryData<RewardsUstBorrowRewardsWasmQuery>;

export type RewardsUstBorrowRewardsQueryParams = Omit<
  MantleParams<RewardsUstBorrowRewardsWasmQuery>,
  'query' | 'variables'
>;

export async function rewardsUstBorrowRewardsQuery({
  mantleEndpoint,
  ...params
}: RewardsUstBorrowRewardsQueryParams): Promise<RewardsUstBorrowRewards> {
  return mantle<RewardsUstBorrowRewardsWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?rewards--ust-borrow-rewards`,
    variables: {},
    ...params,
  });
}
