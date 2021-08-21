import { bluna } from '@anchor-protocol/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@packages/webapp-fns';

export interface BondClaimableRewardsWasmQuery {
  rewardState: WasmQuery<bluna.reward.State, bluna.reward.StateResponse>;
  claimableReward: WasmQuery<bluna.reward.Holder, bluna.reward.HolderResponse>;
}

export type BondClaimableRewards = WasmQueryData<BondClaimableRewardsWasmQuery>;

export type BondClaimableRewardsQueryParams = Omit<
  MantleParams<BondClaimableRewardsWasmQuery>,
  'query' | 'variables'
>;

export async function bondClaimableRewardsQuery({
  mantleEndpoint,
  ...params
}: BondClaimableRewardsQueryParams): Promise<BondClaimableRewards> {
  return mantle<BondClaimableRewardsWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?bond--claimable-rewards`,
    variables: {},
    ...params,
  });
}
