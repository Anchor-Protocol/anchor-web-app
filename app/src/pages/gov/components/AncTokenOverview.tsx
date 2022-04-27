import { Rate } from '@anchor-protocol/types';
import { formatRate } from '@libs/formatter';
import { AnimateNumber, UIElementProps } from '@libs/ui';
import { Divider } from 'components/primitives/Divider';
import { useAncStakingApr } from 'hooks';
import React from 'react';
import styled from 'styled-components';
import { Card, CardHeading, CardSubHeading } from './Card';

const AncTokenOverviewBase = (props: UIElementProps) => {
  const { className } = props;

  const stakingApr = useAncStakingApr();

  return (
    <Card className={className}>
      <section>
        <CardHeading title="ANC" />
      </section>
      <Divider />
      <section>
        <CardSubHeading
          title="STAKING APR"
          tooltip="Total quantity of ANC tokens staked to the governance contract"
        />
        <p className="amount">
          <AnimateNumber format={formatRate}>
            {stakingApr ?? (0 as Rate<number>)}
          </AnimateNumber>
          <span>%</span>
        </p>
      </section>
    </Card>
  );
};

export const AncTokenOverview = styled(AncTokenOverviewBase)`
  height: 100%;

  hr {
    margin: 40px 0;
  }

  .amount {
    font-size: 32px;
    font-weight: 500;

    span:last-child {
      margin-left: 8px;
      font-size: 0.55em;
    }
  }
`;
