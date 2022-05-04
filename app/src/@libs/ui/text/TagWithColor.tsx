import React from 'react';
import styled from 'styled-components';
import { HStack } from '../Stack';

interface TagWithColorProps {
  children: React.ReactNode;
  color: string;
}

export const TagWithColor = ({ children, color }: TagWithColorProps) => (
  <HStack alignItems="center" gap={6}>
    <Color $color={color} />
    {children}
  </HStack>
);

const Color = styled.div<{ $color: string }>`
  border-radius: 2px;
  width: 10px;
  height: 10px;
  background: ${({ $color }) => $color};
`;
