import { HumanAddr } from '@libs/types';
import { uToken } from '../currencies';

export namespace cw20 {
  export interface Balance {
    balance: {
      address: HumanAddr;
    };
  }

  export interface BalanceResponse<T extends uToken> {
    balance: T;
  }

  export interface TokenInfo {
    token_info: {};
  }

  export interface TokenInfoResponse<T extends uToken> {
    decimals: number;
    name: string;
    symbol: symbol;
    total_supply: T;
  }
}
