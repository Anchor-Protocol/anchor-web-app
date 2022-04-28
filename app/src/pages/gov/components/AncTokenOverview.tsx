import { ANC, Rate, u } from '@anchor-protocol/types';
import { formatRate } from '@libs/formatter';
import { AnimateNumber, UIElementProps } from '@libs/ui';
import Big from 'big.js';
import { Divider } from 'components/primitives/Divider';
import { AncTokenomics, useAncTokenomics } from 'hooks';
import { useAncStakingAPRQuery } from 'queries';
import React from 'react';
import styled from 'styled-components';
import { Card, CardHeading, CardSubHeading } from './Card';

const EMPTY_ANC_TOKENOMICS: AncTokenomics = {
  totalSupply: Big(0) as u<ANC<Big>>,
  circulatingSupply: Big(0) as u<ANC<Big>>,
  totalStaked: Big(0) as u<ANC<Big>>,
};

const AncTokenOverviewBase = (props: UIElementProps) => {
  const { className } = props;

  const ancTokenomics = useAncTokenomics() ?? EMPTY_ANC_TOKENOMICS;
  console.log(ancTokenomics);

  const { data: stakingAPR } = useAncStakingAPRQuery();

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
            {stakingAPR ?? (0 as Rate<number>)}
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
