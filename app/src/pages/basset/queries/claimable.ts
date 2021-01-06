import { gql } from '@apollo/client';

export interface StringifiedData {
  rewardState: {
    Result: string;
  };

  claimableReward: {
    Result: string;
  };
}

export interface Data {
  rewardState: {
    global_index: string;
    total_balance: string;
  };

  claimableReward: {
    address: string;
    balance: string;
    index: string;
    pending_rewards: string;
  };
}

export function parseData({
  rewardState,
  claimableReward,
}: StringifiedData): Data {
  return {
    rewardState: JSON.parse(rewardState.Result),
    claimableReward: JSON.parse(claimableReward.Result),
  };
}

export interface StringifiedVariables {
  bAssetRewardContract: string;
  rewardState: string;
  claimableRewardQuery: string;
}

export interface Variables {
  bAssetRewardContract: string;
  rewardState: {
    state: {};
  };
  claimableRewardQuery: {
    holder: {
      address: string;
    };
  };
}

export function stringifyVariables({
  bAssetRewardContract,
  rewardState,
  claimableRewardQuery,
}: Variables): StringifiedVariables {
  return {
    bAssetRewardContract,
    rewardState: JSON.stringify(rewardState),
    claimableRewardQuery: JSON.stringify(claimableRewardQuery),
  };
}

export const query = gql`
  query claimableReward(
    $bAssetRewardContract: String!
    $rewardState: String!
    $claimableRewardQuery: String!
  ) {
    rewardState: WasmContractsContractAddressStore(
      ContractAddress: $bAssetRewardContract
      QueryMsg: $rewardState
    ) {
      Result
    }

    claimableReward: WasmContractsContractAddressStore(
      ContractAddress: $bAssetRewardContract
      QueryMsg: $claimableRewardQuery
    ) {
      Result
    }
  }
`;
