import { uUST } from '../currencies';
import { HumanAddr } from './common';

export namespace beth {
  export namespace rewards {
    export interface AccruedRewards {
      accrued_rewards: {
        address: HumanAddr;
      };
    }

    export interface AccruedRewardsResponse {
      rewards: uUST;
    }
  }
}
