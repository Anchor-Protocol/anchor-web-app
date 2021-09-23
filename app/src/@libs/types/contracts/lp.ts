import { HumanAddr } from '@libs/types';

export namespace lp {
  export interface Minter {
    minter: {};
  }

  export interface MinterResponse {
    /** terraswap pair address */
    minter: HumanAddr;
  }
}
