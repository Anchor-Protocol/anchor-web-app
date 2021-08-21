import { anchorToken, cw20, uANC } from '@anchor-protocol/types';
import {
  mantle,
  MantleParams,
  WasmQuery,
  WasmQueryData,
} from '@packages/webapp-fns';

export interface RewardsAncGovernanceRewardsWasmQuery {
  userGovStakingInfo: WasmQuery<
    anchorToken.gov.Staker,
    anchorToken.gov.StakerResponse
  >;
  userANCBalance: WasmQuery<cw20.Balance, cw20.BalanceResponse<uANC>>;
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
