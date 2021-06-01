import {
  anchorToken,
  cw20,
  CW20Addr,
  HumanAddr,
  uAncUstLP,
  WASMContractResult,
} from '@anchor-protocol/types';
import { MantleFetch } from '@terra-money/webapp-fns';

export interface RewardsClaimableAncUstLpRewardsRawData {
  lPBalance: WASMContractResult;
  lPStakerInfo: WASMContractResult;
}

export interface RewardsClaimableAncUstLpRewardsData {
  lPBalance: cw20.BalanceResponse<uAncUstLP>;
  lPStakerInfo: anchorToken.staking.StakerInfoResponse;
}

export interface RewardsClaimableAncUstLpRewardsRawVariables {
  ancUstLpContract: string;
  ancUstLpStakingContract: string;
  ancUstLpBalanceQuery: string;
  lPStakerInfoQuery: string;
}

export interface RewardsClaimableAncUstLpRewardsVariables {
  ancUstLpContract: CW20Addr;
  ancUstLpStakingContract: HumanAddr;
  ancUstLpBalanceQuery: cw20.Balance;
  lPStakerInfoQuery: anchorToken.staking.StakerInfo;
}

// language=graphql
export const REWARDS_CLAIMABLE_ANC_UST_LP_REWARDS_QUERY = `
  query (
    $ancUstLpContract: String!
    $ancUstLpBalanceQuery: String!
    $ancUstLpStakingContract: String!
    $lPStakerInfoQuery: String!
  ) {
    lPBalance: WasmContractsContractAddressStore(
      ContractAddress: $ancUstLpContract
      QueryMsg: $ancUstLpBalanceQuery
    ) {
      Result
    }

    lPStakerInfo: WasmContractsContractAddressStore(
      ContractAddress: $ancUstLpStakingContract
      QueryMsg: $lPStakerInfoQuery
    ) {
      Result
    }
  }
`;

export interface RewardsClaimableAncUstLpRewardsQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  lastSyncedHeight: () => Promise<number>;
  variables: RewardsClaimableAncUstLpRewardsVariables;
}

export async function rewardsClaimableAncUstLpRewardsQuery({
  mantleEndpoint,
  mantleFetch,
  lastSyncedHeight,
  variables,
}: RewardsClaimableAncUstLpRewardsQueryParams): Promise<RewardsClaimableAncUstLpRewardsData> {
  const blockHeight = await lastSyncedHeight();

  variables.lPStakerInfoQuery.staker_info.block_height = blockHeight + 1;

  const rawData = await mantleFetch<
    RewardsClaimableAncUstLpRewardsRawVariables,
    RewardsClaimableAncUstLpRewardsRawData
  >(
    REWARDS_CLAIMABLE_ANC_UST_LP_REWARDS_QUERY,
    {
      ancUstLpContract: variables.ancUstLpContract,
      ancUstLpStakingContract: variables.ancUstLpStakingContract,
      ancUstLpBalanceQuery: JSON.stringify(variables.ancUstLpBalanceQuery),
      lPStakerInfoQuery: JSON.stringify(variables.lPStakerInfoQuery),
    },
    `${mantleEndpoint}?rewards--claimable-anc-ust-lp-rewards`,
  );

  return {
    lPBalance: JSON.parse(rawData.lPBalance.Result),
    lPStakerInfo: JSON.parse(rawData.lPStakerInfo.Result),
  };
}
