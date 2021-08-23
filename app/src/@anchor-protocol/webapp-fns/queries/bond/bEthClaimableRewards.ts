import { beth } from '@anchor-protocol/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@libs/webapp-fns';

export interface BondBEthClaimableRewardsWasmQuery {
  claimableReward: WasmQuery<
    beth.rewards.AccruedRewards,
    beth.rewards.AccruedRewardsResponse
  >;
}

export type BondBEthClaimableRewards =
  WasmQueryData<BondBEthClaimableRewardsWasmQuery>;

export type BondBEthClaimableRewardsQueryParams = Omit<
  MantleParams<BondBEthClaimableRewardsWasmQuery>,
  'query' | 'variables'
>;

export async function bondBEthClaimableRewardsQuery({
  mantleEndpoint,
  ...params
}: BondBEthClaimableRewardsQueryParams): Promise<BondBEthClaimableRewards> {
  return mantle<BondBEthClaimableRewardsWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?bond--beth-claimable-rewards`,
    variables: {},
    ...params,
  });
}
