import { HumanAddr, u, UST } from '@libs/types';

export namespace beth {
  export namespace rewards {
    export interface AccruedRewards {
      accrued_rewards: {
        address: HumanAddr;
      };
    }

    export interface AccruedRewardsResponse {
      rewards: u<UST>;
    }
  }
}
