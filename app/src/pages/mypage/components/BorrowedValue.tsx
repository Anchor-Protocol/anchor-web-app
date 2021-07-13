import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import { fixHMR } from 'fix-hmr';
import styled from 'styled-components';
import React from 'react';

export interface BorrowedValueProps {
  className?: string;
}

function BorrowedValueBase({ className }: BorrowedValueProps) {
  return <Section className={className}>BorrowedValue</Section>;
}

export const StyledBorrowedValue = styled(BorrowedValueBase)`
  // TODO
`;

export const BorrowedValue = fixHMR(StyledBorrowedValue);
