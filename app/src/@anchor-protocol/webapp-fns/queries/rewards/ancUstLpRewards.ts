import { anchorToken, cw20, uAncUstLP } from '@anchor-protocol/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@libs/webapp-fns';

export interface RewardsAncUstLpRewardsWasmQuery {
  userLPBalance: WasmQuery<cw20.Balance, cw20.BalanceResponse<uAncUstLP>>;
  userLPStakingInfo: WasmQuery<
    anchorToken.staking.StakerInfo,
    anchorToken.staking.StakerInfoResponse
  >;
}

export type RewardsAncUstLpRewards =
  WasmQueryData<RewardsAncUstLpRewardsWasmQuery>;

export type RewardsAncUstLpRewardsQueryParams = Omit<
  MantleParams<RewardsAncUstLpRewardsWasmQuery>,
  'query' | 'variables'
>;

export async function rewardsAncUstLpRewardsQuery({
  mantleEndpoint,
  ...params
}: RewardsAncUstLpRewardsQueryParams): Promise<RewardsAncUstLpRewards> {
  return mantle<RewardsAncUstLpRewardsWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?rewards--anc-ust-lp-rewards`,
    variables: {},
    ...params,
  });
}
