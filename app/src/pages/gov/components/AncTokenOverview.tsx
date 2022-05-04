import { useFormatters } from '@anchor-protocol/formatter';
import { ANC, Rate, u } from '@anchor-protocol/types';
import { formatRate } from '@libs/formatter';
import { AnimateNumber } from '@libs/ui';
import { TitledCard } from '@libs/ui/cards/TitledCard';
import { PieChartValue } from '@libs/ui/charts/PieChartValue';
import { VStack } from '@libs/ui/Stack';
import { ImportantStatistic } from '@libs/ui/text/ImportantStatistic';
import { TagWithColor } from '@libs/ui/text/TagWithColor';
import Big from 'big.js';
import { Divider } from 'components/primitives/Divider';
import { AncTokenomics, useAncTokenomics } from 'hooks';
import { useAncStakingAPRQuery } from 'queries';
import React from 'react';
import styled, { useTheme } from 'styled-components';

const EMPTY_ANC_TOKENOMICS: AncTokenomics = {
  totalSupply: Big(0) as u<ANC<Big>>,
  circulatingSupply: Big(0) as u<ANC<Big>>,
  totalStaked: Big(0) as u<ANC<Big>>,
};

export const AncTokenOverview = () => {
  const {
    anc: { formatOutput, demicrofy },
  } = useFormatters();

  const formatter = (value: u<ANC<Big>>) => formatOutput(demicrofy(value));

  const ancTokenomics = useAncTokenomics() ?? EMPTY_ANC_TOKENOMICS;

  const { data: stakingAPR } = useAncStakingAPRQuery();

  const theme = useTheme();

  return (
    <TitledCard title="ANC">
      <VStack gap={40}>
        <VStack gap={28}>
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
          <VStack gap={36}>
            <PieChartValue
              name="Total staked"
              color={theme.colors.primary}
              value={
                <AnimateNumber format={formatter}>
                  {ancTokenomics.circulatingSupply}
                </AnimateNumber>
              }
            />
            <PieChartValue
              name="Circulating Supply"
              color={theme.colors.primaryDark}
              value={
                <AnimateNumber format={formatter}>
                  {ancTokenomics.circulatingSupply}
                </AnimateNumber>
              }
            />
          </VStack>
        </VStack>
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

const APR = styled.span`
  color: ${({ theme }) => theme.colors.positive};
`;
