import { Token, u } from '@libs/types';
import { HStack, VStack } from '@libs/ui/Stack';
import { BigSource } from 'big.js';
import React from 'react';
import styled from 'styled-components';
import { AnimateNumber } from '@libs/ui';
import { formatUTokenIntegerWithoutPostfixUnits } from '@anchor-protocol/notation';

interface CollateralInfoProps {
  color: string;
  name: string;
  amount: u<Token<BigSource>>;
  share: number;
}

export const CollateralInfo = ({
  color,
  name,
  amount,
  share,
}: CollateralInfoProps) => {
  return (
    <VStack gap={4}>
      <HStack alignItems="center" gap={4}>
        <Color $color={color} />
        <Name>
          {name} <Share>{(share * 100).toFixed(2)}%</Share>
        </Name>
      </HStack>
      <Amount>
        <AnimateNumber format={formatUTokenIntegerWithoutPostfixUnits}>
          {(amount || 0) as u<Token<BigSource>>}
        </AnimateNumber>
        <Denomination>veANC</Denomination>
      </Amount>
    </VStack>
  );
};

const Color = styled.div<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background: ${({ $color }) => $color};
`;

const Name = styled.p`
  font-size: 12px;
  font-weight: 500;
`;

const Amount = styled.p`
  font-size: 18px;
  font-weight: 400;
  color: ${({ theme }) => theme.dimTextColor};
`;

const Denomination = styled.span`
  margin-left: 4px;
  font-size: 0.56em;
`;

const Share = styled.span`
  color: ${({ theme }) => theme.dimTextColor};
`;
