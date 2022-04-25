import { formatUTokenDecimal2 } from '@anchor-protocol/notation';
import { AnimateNumber } from '@libs/ui';
import React from 'react';
import styled from 'styled-components';
import { Token, u } from '@libs/types';
import { BigSource } from 'big.js';

interface Props {
  title: string;
  amount: u<Token<BigSource>>;
  symbol: string;
}

export const AmountTitle = ({ amount, symbol, title }: Props) => {
  return (
    <div>
      <h2>{title}</h2>
      <Amount>
        <AnimateNumber format={formatUTokenDecimal2}>{amount}</AnimateNumber>
        <Denomination>{symbol}</Denomination>
      </Amount>
    </div>
  );
};

const Amount = styled.p`
  font-size: 32px;
  font-weight: 500;
`;

const Denomination = styled.span`
  margin-left: 8px;
  font-size: 0.56em;
`;
