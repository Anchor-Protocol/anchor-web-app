import { HumanAddr, u, UST } from '@libs/types';

export namespace basset {
  export namespace converter {
    export interface Config {
      config: {};
    }

    export interface ConfigResponse {
      owner: HumanAddr;
      anchor_token_address: HumanAddr | null;
      wormhole_token_address: HumanAddr | null;
    }
  }

  export namespace reward {
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
