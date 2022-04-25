import { formatUTokenDecimal2 } from '@anchor-protocol/notation';
import { AnimateNumber } from '@libs/ui';
import React from 'react';
import styled from 'styled-components';
import { Token, u } from '@libs/types';
import { BigSource } from 'big.js';
import { Sub } from 'components/Sub';
import { Rate } from '@anchor-protocol/types';
import { formatRate } from '@libs/formatter';

interface Props {
  title: string;
  amount: u<Token<BigSource>>;
  symbol: string;
  rate?: Rate<BigSource>;
}

export const AmountTitle = ({ amount, symbol, title, rate }: Props) => {
  return (
    <div>
      <h2>{title}</h2>
      <Amount>
        <AnimateNumber format={formatUTokenDecimal2}>{amount}</AnimateNumber>{' '}
        <Sub>
          {symbol}{' '}
          {rate !== undefined && (
            <span>
              (<AnimateNumber format={formatRate}>{rate}</AnimateNumber>
              %)
            </span>
          )}
        </Sub>
      </Amount>
    </div>
  );
};

const Amount = styled.p`
  font-size: 32px;
  font-weight: 500;
`;
