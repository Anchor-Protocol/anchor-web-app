import { useFormatters } from '@anchor-protocol/formatter';
import { ANC, Rate, u } from '@anchor-protocol/types';
import { formatRate } from '@libs/formatter';
import { AnimateNumber, UIElementProps } from '@libs/ui';
import { TitledCard } from '@libs/ui/cards/TitledCard';
import { VStack } from '@libs/ui/Stack';
import { ImportantStatistic } from '@libs/ui/text/ImportantStatistic';
import { TagWithColor } from '@libs/ui/text/TagWithColor';
import Big from 'big.js';
import { Divider } from 'components/primitives/Divider';
import { Sub } from 'components/Sub';
import { AncTokenomics, useAncTokenomics } from 'hooks';
import { useAncStakingAPRQuery } from 'queries';
import React from 'react';
import styled, { useTheme } from 'styled-components';
import { CardSubHeading, CardSubHeadingProps } from './Card';

const EMPTY_ANC_TOKENOMICS: AncTokenomics = {
  totalSupply: Big(0) as u<ANC<Big>>,
  circulatingSupply: Big(0) as u<ANC<Big>>,
  totalStaked: Big(0) as u<ANC<Big>>,
};

interface LabelWithValueProps extends CardSubHeadingProps {}

const LabelWithValue = (props: LabelWithValueProps) => {
  const { title, tooltip, children } = props;

  return (
    <>
      <CardSubHeading className="subHeading" title={title} tooltip={tooltip} />
      <Amount>{children}</Amount>
    </>
  );
};

export const AncTokenOverview = (props: UIElementProps) => {
  const {
    anc: { formatOutput, demicrofy, symbol },
  } = useFormatters();

  const formatter = (value: u<ANC<Big>>) => formatOutput(demicrofy(value));

  const ancTokenomics = useAncTokenomics() ?? EMPTY_ANC_TOKENOMICS;

  const { data: stakingAPR } = useAncStakingAPRQuery();

  const theme = useTheme();

  return (
    <TitledCard title="ANC">
      <VStack gap={40}>
        <ImportantStatistic
          name={
            <TagWithColor color={theme.textColor}>
              <p>TOTAL SUPPLY</p>
            </TagWithColor>
          }
          value={
            <AnimateNumber format={formatter}>
              {ancTokenomics.totalSupply}
            </AnimateNumber>
          }
        />
        <section>
          <LabelWithValue
            title="CIRCULATING SUPPLY"
            tooltip="Total supply of ANC tokens that are currently in circulation"
          >
            <AnimateNumber format={formatter}>
              {ancTokenomics.circulatingSupply}
            </AnimateNumber>
            <Sub>{` ${symbol}`}</Sub>
          </LabelWithValue>
          <LabelWithValue
            title="TOTAL STAKED"
            tooltip="Total amount of ANC tokens that are currently staked in the governance contract"
          >
            <AnimateNumber format={formatter}>
              {ancTokenomics.totalStaked}
            </AnimateNumber>
            <Sub>{` ${symbol}`}</Sub>
          </LabelWithValue>
        </section>
        <Divider />
        <ImportantStatistic
          name="ANC Staking APR"
          value={
            <APR>
              <AnimateNumber format={formatRate}>
                {stakingAPR ?? (0 as Rate<number>)}
              </AnimateNumber>
              <span>%</span>
            </APR>
          }
        />
      </VStack>
    </TitledCard>
  );
};

const Amount = styled.p`
  font-size: 32px;
  font-weight: 500;

  span:last-child {
    margin-left: 8px;
    font-size: 0.55em;
  }
`;

const APR = styled.span`
  color: ${({ theme }) => theme.colors.positive};
`;
