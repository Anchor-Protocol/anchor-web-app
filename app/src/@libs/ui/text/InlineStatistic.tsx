import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { HStack } from '../Stack';

type InlineStatisticKind = 'primary' | 'secondary';

interface InlineStatisticProps {
  name: ReactNode;
  value: ReactNode;
  kind?: InlineStatisticKind;
}

export const InlineStatistic = ({
  name,
  value,
  kind = 'primary',
}: InlineStatisticProps) => {
  return (
    <HStack
      gap={8}
      justifyContent="space-between"
      alignItems="center"
      fullWidth
    >
      <Name kind={kind}>{name}</Name>
      <Value>{value}</Value>
    </HStack>
  );
};

const Name = styled.p<{ kind: InlineStatisticKind }>`
  font-weight: 500;
  font-size: 13px;
  color: ${({ kind, theme }) =>
    kind === 'primary' ? theme.textColor : theme.dimTextColor};
`;

const Value = styled.p`
  font-weight: 500;
  font-size: 14px;
  text-align: end;
`;
