import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import { fixHMR } from 'fix-hmr';
import styled from 'styled-components';
import React from 'react';

export interface TotalCollateralValueProps {
  className?: string;
}

function TotalCollateralValueBase({ className }: TotalCollateralValueProps) {
  return <Section className={className}>TotalCollateralValue</Section>;
}

export const StyledTotalCollateralValue = styled(TotalCollateralValueBase)`
  // TODO
`;

export const TotalCollateralValue = fixHMR(StyledTotalCollateralValue);
