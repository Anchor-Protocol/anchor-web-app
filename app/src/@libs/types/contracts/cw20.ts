import { HumanAddr, Token, u } from '@libs/types';

export namespace cw20 {
  // ---------------------------------------------
  // HandleMsg
  // ---------------------------------------------
  export interface IncreaseAllowance {
    increase_allowance: {
      spender: HumanAddr;
      amount: u<Token>;
      expires?: { at_height: number } | { at_time: number } | { never: {} };
    };
  }

  export interface Send<T extends Token> {
    send: {
      amount: u<T>;
      contract: HumanAddr;
      msg: string;
    };
  }

  // ---------------------------------------------
  // QueryMsg
  // ---------------------------------------------
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
    symbol: string;
    total_supply: u<T>;
  }

  export interface Minter {
    minter: {};
  }

  export interface MinterResponse {
    minter: HumanAddr;
    cap: null;
  }
}
