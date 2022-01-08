import { CW20Addr, HumanAddr } from '../addrs';
import { Astro, Token, u } from '../tokens';

export namespace astroport {
  export namespace QueryMsg {
    export interface Deposit {
      deposit: {
        lp_token: CW20Addr;
        user: HumanAddr;
      };
    }

    export type DepositResponse<T extends Token> = u<T>;

    export interface PendingToken {
      pending_token: {
        lp_token: CW20Addr;
        user: HumanAddr;
      };
    }

    export interface PendingTokenResponse<T extends Token> {
      // astroport rewards
      pending: u<Astro>;

      // staking rewards
      pending_on_proxy: u<T>;
    }
  }
}
