import { anchorToken, cw20, uAncUstLP } from '@anchor-protocol/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@packages/webapp-fns';

export interface RewardsClaimableAncUstLpRewardsWasmQuery {
  lPBalance: WasmQuery<cw20.Balance, cw20.BalanceResponse<uAncUstLP>>;
  lPStakerInfo: WasmQuery<
    anchorToken.staking.StakerInfo,
    anchorToken.staking.StakerInfoResponse
  >;
}

export type RewardsClaimableAncUstLpRewards =
  WasmQueryData<RewardsClaimableAncUstLpRewardsWasmQuery>;

export type RewardsClaimableAncUstLpRewardsQueryParams = Omit<
  MantleParams<RewardsClaimableAncUstLpRewardsWasmQuery>,
  'query' | 'variables'
> & {
  lastSyncedHeight: () => Promise<number>;
};

export async function rewardsClaimableAncUstLpRewardsQuery({
  mantleEndpoint,
  wasmQuery,
  lastSyncedHeight,
  ...params
}: RewardsClaimableAncUstLpRewardsQueryParams): Promise<RewardsClaimableAncUstLpRewards> {
  const blockHeight = await lastSyncedHeight();

  wasmQuery.lPStakerInfo.query.staker_info.block_height = blockHeight + 1;

  return mantle<RewardsClaimableAncUstLpRewardsWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?rewards--claimable-anc-ust-lp-rewards`,
    variables: {},
    wasmQuery,
    ...params,
  });
}
