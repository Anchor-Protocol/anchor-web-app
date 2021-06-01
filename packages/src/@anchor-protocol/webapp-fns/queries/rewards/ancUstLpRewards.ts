import {
  anchorToken,
  cw20,
  CW20Addr,
  HumanAddr,
  uAncUstLP,
  WASMContractResult,
} from '@anchor-protocol/types';
import { MantleFetch } from '@terra-money/webapp-fns';

export interface RewardsAncUstLpRewardsRawData {
  userLPBalance: WASMContractResult;
  userLPStakingInfo: WASMContractResult;
}

export interface RewardsAncUstLpRewardsData {
  userLPBalance: cw20.BalanceResponse<uAncUstLP>;
  userLPStakingInfo: anchorToken.staking.StakerInfoResponse;
}

export interface RewardsAncUstLpRewardsRawVariables {
  ancUstLpContract: string;
  ancUstLpBalanceQuery: string;
  stakingContract: string;
  lpStakerInfoQuery: string;
}

export interface RewardsAncUstLpRewardsVariables {
  ancUstLpContract: CW20Addr;
  stakingContract: HumanAddr;
  ancUstLpBalanceQuery: cw20.Balance;
  lpStakerInfoQuery: anchorToken.staking.StakerInfo;
}

// language=graphql
export const REWARDS_ANC_UST_LP_REWARDS_QUERY = `
  query (
    $ancUstLpContract: String!
    $ancUstLpBalanceQuery: String!
    $stakingContract: String!
    $lpStakerInfoQuery: String!
  ) {
    userLPBalance: WasmContractsContractAddressStore(
      ContractAddress: $ancUstLpContract
      QueryMsg: $ancUstLpBalanceQuery
    ) {
      Result
    }

    userLPStakingInfo: WasmContractsContractAddressStore(
      ContractAddress: $stakingContract
      QueryMsg: $lpStakerInfoQuery
    ) {
      Result
    }
  }
`;

export interface RewardsAncUstLpRewardsQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  variables: RewardsAncUstLpRewardsVariables;
}

export async function rewardsAncUstLpRewardsQuery({
  mantleEndpoint,
  mantleFetch,
  variables,
}: RewardsAncUstLpRewardsQueryParams): Promise<RewardsAncUstLpRewardsData> {
  const rawData = await mantleFetch<
    RewardsAncUstLpRewardsRawVariables,
    RewardsAncUstLpRewardsRawData
  >(
    REWARDS_ANC_UST_LP_REWARDS_QUERY,
    {
      ancUstLpContract: variables.ancUstLpContract,
      stakingContract: variables.stakingContract,
      ancUstLpBalanceQuery: JSON.stringify(variables.ancUstLpBalanceQuery),
      lpStakerInfoQuery: JSON.stringify(variables.lpStakerInfoQuery),
    },
    `${mantleEndpoint}?rewards--anc-ust-lp-rewards`,
  );

  return {
    userLPBalance: JSON.parse(rawData.userLPBalance.Result),
    userLPStakingInfo: JSON.parse(rawData.userLPStakingInfo.Result),
  };
}
