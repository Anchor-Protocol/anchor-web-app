import { useFormatters } from '@anchor-protocol/formatter';
import { ANC, Rate, u } from '@anchor-protocol/types';
import { formatRate } from '@libs/formatter';
import { AnimateNumber } from '@libs/ui';
import { TitledCard } from '@libs/ui/cards/TitledCard';
import {
  NestedPieChart,
  NestedPieChartData,
} from '@libs/ui/charts/NestedPieChart';
import { PieChartValue } from '@libs/ui/charts/PieChartValue';
import { HStack, VStack } from '@libs/ui/Stack';
import { ImportantStatistic } from '@libs/ui/text/ImportantStatistic';
import { TagWithColor } from '@libs/ui/text/TagWithColor';
import Big from 'big.js';
import { Divider } from 'components/primitives/Divider';
import { AncTokenomics, useAncTokenomics } from 'hooks';
import { useAncStakingAPRQuery } from 'queries';
import React, { useMemo } from 'react';
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
  const totalSupplyColor = theme.textColor;
  const circulatingSupplyColor = theme.chart[2];
  const totalStakedColor = theme.chart[0];

  const chartData: NestedPieChartData[] = useMemo(() => {
    return [
      {
        value: ancTokenomics.totalSupply.toNumber(),
        color: totalSupplyColor,
      },
      {
        value: ancTokenomics.circulatingSupply.toNumber(),
        color: circulatingSupplyColor,
      },
      {
        value: ancTokenomics.totalStaked.toNumber(),
        color: totalStakedColor,
      },
    ];
  }, [
    ancTokenomics.circulatingSupply,
    ancTokenomics.totalStaked,
    ancTokenomics.totalSupply,
    circulatingSupplyColor,
    totalStakedColor,
    totalSupplyColor,
  ]);

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
          <HStack wrap="wrap" alignItems="center" gap={40}>
            <ChartWr>
              <NestedPieChart data={chartData} />
            </ChartWr>
            <VStack gap={36}>
              <PieChartValue
                name="Total staked"
                color={totalStakedColor}
                value={
                  <AnimateNumber format={formatter}>
                    {ancTokenomics.totalStaked}
                  </AnimateNumber>
                }
              />
              <PieChartValue
                name="Circulating Supply"
                color={circulatingSupplyColor}
                value={
                  <AnimateNumber format={formatter}>
                    {ancTokenomics.circulatingSupply}
                  </AnimateNumber>
                }
              />
            </VStack>
          </HStack>
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

const ChartWr = styled.div`
  width: 145px;
  height: 145px;
`;
