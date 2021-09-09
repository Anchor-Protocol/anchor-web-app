import { ANC, anchorToken, cw20, u } from '@anchor-protocol/types';
import { mantle, MantleParams, WasmQuery, WasmQueryData } from '@libs/mantle';

export interface RewardsAncGovernanceRewardsWasmQuery {
  userGovStakingInfo: WasmQuery<
    anchorToken.gov.Staker,
    anchorToken.gov.StakerResponse
  >;
  userANCBalance: WasmQuery<cw20.Balance, cw20.BalanceResponse<u<ANC>>>;
}

export type RewardsAncGovernanceRewards =
  WasmQueryData<RewardsAncGovernanceRewardsWasmQuery>;

export type RewardsAncGovernanceRewardsQueryParams = Omit<
  MantleParams<RewardsAncGovernanceRewardsWasmQuery>,
  'query' | 'variables'
>;

export async function rewardsAncGovernanceRewardsQuery({
  mantleEndpoint,
  ...params
}: RewardsAncGovernanceRewardsQueryParams): Promise<RewardsAncGovernanceRewards> {
  return mantle<RewardsAncGovernanceRewardsWasmQuery>({
    mantleEndpoint: `${mantleEndpoint}?rewards--anc-governance-rewards`,
    variables: {},
    ...params,
  });
}
