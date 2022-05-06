import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { VStack } from '../Stack';

interface ImportantStatisticProps {
  name: ReactNode;
  value: ReactNode;
}

export const ImportantStatistic = ({
  name,
  value,
}: ImportantStatisticProps) => (
  <VStack gap={16}>
    <Name>{name}</Name>
    <Value>{value}</Value>
  </VStack>
);

const Name = styled.div`
  font-weight: 500;
  font-size: 12px;
  text-transform: uppercase;
`;

const Value = styled.p`
  font-weight: 400;
  font-size: 32px;
`;
