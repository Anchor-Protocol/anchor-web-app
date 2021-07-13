import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import { fixHMR } from 'fix-hmr';
import React from 'react';
import styled from 'styled-components';

export interface EarnProps {
  className?: string;
}

function EarnBase({ className }: EarnProps) {
  return <Section className={className}>Earn</Section>;
}

export const StyledEarn = styled(EarnBase)`
  // TODO
`;

export const Earn = fixHMR(StyledEarn);
