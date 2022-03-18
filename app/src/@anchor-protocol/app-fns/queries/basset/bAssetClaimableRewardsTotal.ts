import { QueryClient } from '@libs/query-client';
import { HumanAddr, u, UST } from '@libs/types';
import big from 'big.js';
import {
  BAssetClaimableRewards,
  bAssetClaimableRewardsQuery,
} from './bAssetClaimableRewards';

export interface BAssetClaimableRewardsTotal {
  rewards: Array<[contract: HumanAddr, reward: BAssetClaimableRewards]>;
  total: u<UST>;
}

export async function bAssetClaimableRewardsTotalQuery(
  walletAddr: HumanAddr | undefined,
  rewardContracts: HumanAddr[],
  queryClient: QueryClient,
): Promise<BAssetClaimableRewardsTotal> {
  if (!walletAddr || rewardContracts.length === 0) {
    return {
      rewards: [],
      total: '0' as u<UST>,
    };
  }

  const rewards = await Promise.all(
    rewardContracts.map((rewardContract) =>
      bAssetClaimableRewardsQuery(walletAddr, rewardContract, queryClient),
    ),
  ).then((arr) => {
    return arr.map(
      (item, i) =>
        [rewardContracts[i], item!] as [HumanAddr, BAssetClaimableRewards],
    );
  });

  const total = rewards.reduce((t, [_, { claimableReward }]) => {
    return t.plus(claimableReward.rewards);
  }, big(0));

  return {
    rewards,
    total: total.toFixed() as u<UST>,
  };
}
