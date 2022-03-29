import { ANCHOR_QUERY_KEY } from '@anchor-protocol/app-provider';
import { Micro, u } from '@libs/types';
import Big from 'big.js';
import { useAccount } from 'contexts/account';
import { useBalances } from 'contexts/balances';
import { useAnchorQuery } from './useAnchorQuery';

// enum TokenKind {
//   Text,
//   CW20,
//   ERC20,
// }

// export interface TextToken {
//   kind: TokenKind.Text;
//   text: string;
// }

// export interface CW20Token {
//   kind: TokenKind.CW20;
//   address: string;
// }

// export interface ERC20Token {
//   kind: TokenKind.ERC20;
//   address: string;
// }

// type TokenType = TextToken | CW20Token | ERC20Token;

// export class Token {
//   static from(value: string): TokenType {
//     // HERE: use a pattern match
//     return {
//       kind: TokenKind.Text,
//       text: value,
//     };
//   }
// }

export const useTokenBalance = <T extends Big & Micro>(token: string) => {
  const { nativeWalletAddress } = useAccount();

  const { fetchBalance } = useBalances();

  const query = useAnchorQuery(
    [ANCHOR_QUERY_KEY.TOKEN_BALANCES, nativeWalletAddress, token],
    async (context) => {
      if (
        context.queryKey[1] === undefined ||
        context.queryKey[2] === undefined
      ) {
        return Big(0) as T;
      }
      const balance = await fetchBalance(
        context.queryKey[1],
        context.queryKey[2],
      );
      return Big(balance) as u<T>;
    },
    {
      keepPreviousData: false,
    },
  );

  return query?.data;
};
