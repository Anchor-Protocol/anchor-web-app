import { UIElementProps } from '@libs/ui';
import React from 'react';
import styled from 'styled-components';
import { CollateralDistribution } from './CollateralDistribution';
import { MyVotingPower } from './MyVotingPower';
import { OverviewCard } from './OverviewCard';

function OverviewBase(props: UIElementProps) {
  const { className } = props;
  return (
    <div className={className}>
      <OverviewCard className="card">
        <MyVotingPower />
      </OverviewCard>
      <OverviewCard className="card">
        <CollateralDistribution />
      </OverviewCard>
    </div>
  );
}

export const Overview = styled(OverviewBase)`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 40px;
`;
