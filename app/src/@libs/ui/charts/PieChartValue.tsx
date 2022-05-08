import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { VStack } from '../Stack';
import { TagWithColor } from '../text/TagWithColor';

interface PieChartValueProps {
  color: string;
  name: ReactNode;
  value: ReactNode;
}

export const PieChartValue = ({ name, color, value }: PieChartValueProps) => (
  <VStack gap={8}>
    <TagWithColor color={color}>
      <Name>{name}</Name>
    </TagWithColor>
    <Value>{value}</Value>
  </VStack>
);

const Name = styled.p`
  font-weight: 500;
  font-size: 12px;
  color: ${({ theme }) => theme.dimTextColor};
`;

const Value = styled.p`
  font-weight: 400;
  font-size: 18px;
`;
