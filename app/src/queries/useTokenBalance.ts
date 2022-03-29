import { HumanAddr } from '@libs/types';

enum TokenKind {
  Text,
  CW20,
  ERC20,
}

export interface TextToken {
  kind: TokenKind.Text;
  text: string;
}

export interface CW20Token {
  kind: TokenKind.CW20;
  address: string;
}

export interface ERC20Token {
  kind: TokenKind.ERC20;
  address: string;
}

type TokenType = TextToken | CW20Token | ERC20Token;

export class Token {
  static from(value: string): TokenType {
    // HERE: use a pattern match
    return {
      kind: TokenKind.Text,
      text: value,
    };
  }
}

export const useTokenBalance = (walletAddr: HumanAddr, token: string) => {
  //HERE
};
