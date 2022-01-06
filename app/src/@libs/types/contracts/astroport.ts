import { CW20Addr, HumanAddr } from '@libs/types/addrs';

export namespace astroport {
  export namespace QueryMsg {
    export interface Deposit {
      deposit: {
        lp_token: CW20Addr;
        user: HumanAddr;
      };
    }
  }
}
