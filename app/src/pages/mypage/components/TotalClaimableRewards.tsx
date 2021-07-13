import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import { fixHMR } from 'fix-hmr';
import React from 'react';
import styled from 'styled-components';

export interface TotalClaimableRewardsProps {
  className?: string;
}

function TotalClaimableRewardsBase({ className }: TotalClaimableRewardsProps) {
  return <Section className={className}>TotalClaimableRewards</Section>;
}

export const StyledTotalClaimableRewards = styled(TotalClaimableRewardsBase)`
  // TODO
`;

export const TotalClaimableRewards = fixHMR(StyledTotalClaimableRewards);
