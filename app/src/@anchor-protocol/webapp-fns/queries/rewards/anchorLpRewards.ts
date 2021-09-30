import { DateTime, Num } from '@anchor-protocol/types';

export interface RewardsAnchorLpRewardsData {
  anchorLpRewards: Array<{
    APY: Num;
    Height: number;
    Timestamp: DateTime;
  }>;
}

export async function rewardsAnchorLpRewardsQuery(): Promise<RewardsAnchorLpRewardsData> {
  return fetch('https://api.anchorprotocol.com/api/v2/ust-lp-reward')
    .then((res) => res.json())
    .then(
      ({
        height,
        timestamp,
        apy,
      }: {
        height: number;
        timestamp: DateTime;
        apy: Num;
      }) => {
        return {
          APY: apy,
          Height: height,
          Timestamp: timestamp,
        };
      },
    )
    .then((data) => {
      return { anchorLpRewards: [data] };
    });
}
