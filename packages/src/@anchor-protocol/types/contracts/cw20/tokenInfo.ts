import { uToken } from '../../currencies';

export interface TokenInfo {
  token_info: {};
}

export interface TokenInfoResponse<T extends uToken> {
  decimals: number;
  name: string;
  symbol: symbol;
  total_supply: T;
}
