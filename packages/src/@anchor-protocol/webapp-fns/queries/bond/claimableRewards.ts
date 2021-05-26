import { bluna, WASMContractResult } from '@anchor-protocol/types';
import { MantleFetch } from '@terra-money/webapp-fns';

export interface BondClaimableRewardsRawData {
  rewardState: WASMContractResult;
  claimableReward: WASMContractResult;
}

export interface BondClaimableRewardsData {
  rewardState: bluna.reward.StateResponse;
  claimableReward: bluna.reward.HolderResponse;
}

export interface BondClaimableRewardsRawVariables {
  bAssetRewardContract: string;
  rewardStateQuery: string;
  rewardHolderQuery: string;
}

export interface BondClaimableRewardsVariables {
  bAssetRewardContract: string;
  rewardStateQuery: bluna.reward.State;
  rewardHolderQuery: bluna.reward.Holder;
}

// language=graphql
export const BOND_CLAIMABLE_REWARDS_QUERY = `
  query (
    $bAssetRewardContract: String!
    $rewardStateQuery: String!
    $rewardHolderQuery: String!
  ) {
    rewardState: WasmContractsContractAddressStore(
      ContractAddress: $bAssetRewardContract
      QueryMsg: $rewardStateQuery
    ) {
      Result
    }

    claimableReward: WasmContractsContractAddressStore(
      ContractAddress: $bAssetRewardContract
      QueryMsg: $rewardHolderQuery
    ) {
      Result
    }
  }
`;

export interface BondClaimableRewardsQueryParams {
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  variables: BondClaimableRewardsVariables;
}

export async function bondClaimableRewardsQuery({
  mantleEndpoint,
  mantleFetch,
  variables,
}: BondClaimableRewardsQueryParams): Promise<BondClaimableRewardsData> {
  const rawData = await mantleFetch<
    BondClaimableRewardsRawVariables,
    BondClaimableRewardsRawData
  >(
    BOND_CLAIMABLE_REWARDS_QUERY,
    {
      bAssetRewardContract: variables.bAssetRewardContract,
      rewardStateQuery: JSON.stringify(variables.rewardStateQuery),
      rewardHolderQuery: JSON.stringify(variables.rewardHolderQuery),
    },
    `${mantleEndpoint}?bond--claimable-rewards`,
  );

  return {
    rewardState: JSON.parse(rawData.rewardState.Result),
    claimableReward: JSON.parse(rawData.claimableReward.Result),
  };
}
