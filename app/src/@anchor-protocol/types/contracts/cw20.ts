import { HumanAddr, Token, u } from '@libs/types';

export namespace cw20 {
  export interface Balance {
    balance: {
      address: HumanAddr;
    };
  }

  export interface BalanceResponse<T extends Token> {
    balance: u<T>;
  }

  export interface TokenInfo {
    token_info: {};
  }

  export interface TokenInfoResponse<T extends Token> {
    decimals: number;
    name: string;
    symbol: symbol;
    total_supply: u<T>;
  }
}
