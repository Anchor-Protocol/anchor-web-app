import { HumanAddr } from '@libs/types';
import { uUST } from '../currencies';

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
