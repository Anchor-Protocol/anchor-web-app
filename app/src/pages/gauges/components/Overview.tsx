import { UIElementProps } from '@libs/ui';
import React from 'react';
import styled from 'styled-components';
import { CollateralDistribution } from './CollateralDistribution';
import { OverviewCard } from './OverviewCard';

function OverviewBase(props: UIElementProps) {
  const { className } = props;
  return (
    <div className={className}>
      <OverviewCard className="card">
        <div>asdkj</div>
      </OverviewCard>
      <OverviewCard className="card">
        <div>asdkj</div>
      </OverviewCard>
      <OverviewCard className="card">
        <CollateralDistribution />
      </OverviewCard>
    </div>
  );
}

export const Overview = styled(OverviewBase)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 40px;
`;
