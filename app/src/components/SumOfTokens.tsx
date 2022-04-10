import React from 'react';
import { u, Token as TokenAmount } from '@anchor-protocol/types';
import { formatOutput } from '@anchor-protocol/formatter';
import { demicrofy } from '@libs/formatter';

interface Token {
  amount: u<TokenAmount>;
  symbol: string;
}

interface SumOfTokensProps {
  tokens: Token[];
}

export const SumOfTokens = ({ tokens }: SumOfTokensProps) => {
  return (
    <p>
      {tokens
        .map(
          ({ symbol, amount }) =>
            `${formatOutput(demicrofy(amount))} ${symbol}`,
        )
        .join(' + ')}
    </p>
  );
};
