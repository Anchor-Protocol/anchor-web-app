import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import { fixHMR } from 'fix-hmr';
import styled from 'styled-components';
import React from 'react';

export interface GovernProps {
  className?: string;
}

function GovernBase({ className }: GovernProps) {
  return <Section className={className}>Govern</Section>;
}

export const StyledGovern = styled(GovernBase)`
  // TODO
`;

export const Govern = fixHMR(StyledGovern);
