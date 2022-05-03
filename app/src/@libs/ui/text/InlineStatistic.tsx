import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { HStack } from '../Stack';

interface InlineStatisticProps {
  name: ReactNode;
  value: ReactNode;
}

export const InlineStatistic = ({ name, value }: InlineStatisticProps) => {
  return (
    <HStack justifyContent="space-between" alignItems="center" fullWidth>
      <Name>{name}</Name>
      <Value>{value}</Value>
    </HStack>
  );
};

const Name = styled.p`
  font-weight: 500;
  font-size: 13px;
  color: ${({ theme }) => theme.dimTextColor};
`;

const Value = styled.p`
  font-weight: 500;
  font-size: 14px;
  text-align: end;
`;
