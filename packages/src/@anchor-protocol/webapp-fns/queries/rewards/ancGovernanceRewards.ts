import {
  anchorToken,
  cw20,
  CW20Addr,
  HumanAddr,
  uANC,
  WASMContractResult,
} from '@anchor-protocol/types';
import { MantleFetch } from '@terra-money/webapp-fns';

export interface RewardsAncGovernanceRewardsRawData {
  userGovStakingInfo: WASMContractResult;
  userANCBalance: WASMContractResult;
}

export interface RewardsAncGovernanceRewardsData {
  userGovStakingInfo: anchorToken.gov.StakerResponse;
  userANCBalance: cw20.BalanceResponse<uANC>;
}

export interface RewardsAncGovernanceRewardsRawVariables {
  govContract: string;
  govStakeInfoQuery: string;
  ancContract: string;
  userAncBalanceQuery: string;
}

export interface RewardsAncGovernanceRewardsVariables {
  govContract: HumanAddr;
  ancContract: CW20Addr;
  govStakeInfoQuery: anchorToken.gov.Staker;
  userAncBalanceQuery: cw20.Balance;
}

// language=graphql
export const REWARDS_ANC_GOVERNANCE_REWARDS_QUERY = `
  query (
    $govContract: String!
    $govStakeInfoQuery: String!
    $ancContract: String!
    $userAncBalanceQuery: String!
  ) {
    userGovStakingInfo: WasmContractsContractAddressStore(
      ContractAddress: $govContract
      QueryMsg: $govStakeInfoQuery
    ) {
      Result
    }

    userANCBalance: WasmContractsContractAddressStore(
      ContractAddress: $ancContract
      QueryMsg: $userAncBalanceQuery
    ) {
      Result
    }
  }
`;

export interface RewardsAncGovernanceRewardsQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  variables: RewardsAncGovernanceRewardsVariables;
}

export async function rewardsAncGovernanceRewardsQuery({
  mantleEndpoint,
  mantleFetch,
  variables,
}: RewardsAncGovernanceRewardsQueryParams): Promise<RewardsAncGovernanceRewardsData> {
  const rawData = await mantleFetch<
    RewardsAncGovernanceRewardsRawVariables,
    RewardsAncGovernanceRewardsRawData
  >(
    REWARDS_ANC_GOVERNANCE_REWARDS_QUERY,
    {
      govContract: variables.govContract,
      ancContract: variables.ancContract,
      govStakeInfoQuery: JSON.stringify(variables.govStakeInfoQuery),
      userAncBalanceQuery: JSON.stringify(variables.userAncBalanceQuery),
    },
    `${mantleEndpoint}?rewards--anc-governance-rewards`,
  );

  return {
    userGovStakingInfo: JSON.parse(rawData.userGovStakingInfo.Result),
    userANCBalance: JSON.parse(rawData.userANCBalance.Result),
  };
}
