import { Token, u } from '@libs/types';
import { BigSource } from 'big.js';
import React from 'react';
import styled, { css } from 'styled-components';
import { AnimateNumber } from '@libs/ui';
import { formatUTokenDecimal2 } from '@anchor-protocol/notation';

interface CollateralInfoProps {
  color: string;
  name: string;
  amount: u<Token<BigSource>>;
  share: number;
  isFocused?: boolean;
}

export const CollateralInfo = ({
  color,
  name,
  amount,
  share,
  isFocused,
}: CollateralInfoProps) => {
  return (
    <Container>
      <Color isFocused={!!isFocused} $color={color} />
      <Name>
        {name} <Share>{(share * 100).toFixed(2)}%</Share>
      </Name>
      <div />
      <Amount>
        <AnimateNumber format={formatUTokenDecimal2}>
          {(amount || 0) as u<Token<BigSource>>}
        </AnimateNumber>
      </Amount>
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: 10px auto;
  gap: 0 4px;
  align-items: center;
`;

const Color = styled.div<{ $color: string; isFocused: boolean }>`
  width: 7px;
  height: 7px;
  background: ${({ $color }) => $color};

  transition: transform 0.3s ease-out, border-radius 0.3s ease-out;

  ${({ isFocused }) =>
    isFocused &&
    css`
      transform: scale(2);
      border-radius: 50%;
    `}
`;

const Name = styled.p`
  font-size: 12px;
  font-weight: 500;
`;

const Amount = styled.p`
  font-size: 13px;
  line-height: 1.5;
  font-weight: 400;
  color: ${({ theme }) => theme.textColor};
`;

const Share = styled.span`
  color: ${({ theme }) => theme.dimTextColor};
`;
