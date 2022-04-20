import { formatUTokenIntegerWithoutPostfixUnits } from '@anchor-protocol/notation';
import { Token, u } from '@libs/types';
import { AnimateNumber } from '@libs/ui';
import Big, { BigSource } from 'big.js';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { getPaletteColor } from '@libs/ui/colors/palette';
import { colorToCSSValue } from '@libs/ui/colors/colorToCSSValue';
import { DoughnutChart } from 'pages/dashboard/components/DoughnutChart';
import { HStack, VStack } from '@libs/ui/Stack';
import { CollateralInfo } from './CollateralInfo';
import { useGaugesQuery } from 'queries/gov/useGaugesQuery';

export const CollateralDistribution = () => {
  const {
    data: { collateral, totalVotes } = { collateral: [], totalVotes: 0 },
  } = useGaugesQuery();

  const descriptors = useMemo(
    () =>
      collateral.map(({ symbol, votes }, index) => ({
        label: symbol,
        color: colorToCSSValue(getPaletteColor(index)),
        value: Big(votes).toNumber(),
      })),
    [collateral],
  );

  return (
    <VStack gap={40}>
      <div>
        <h2>TOTAL STAKED</h2>
        <Amount>
          <AnimateNumber format={formatUTokenIntegerWithoutPostfixUnits}>
            {(totalVotes || 0) as u<Token<BigSource>>}
          </AnimateNumber>
          <Denomination>veANC</Denomination>
        </Amount>
      </div>
      <HStack alignItems="center" gap={40}>
        <ChartWr>
          <DoughnutChart descriptors={descriptors} />
        </ChartWr>
        <VStack gap={20}>
          {collateral.map(({ symbol, votes, share }, index) => (
            <CollateralInfo
              key={symbol}
              color={getPaletteColor(index)}
              name={symbol}
              amount={votes}
              share={share}
            />
          ))}
        </VStack>
      </HStack>
    </VStack>
  );
};

const Amount = styled.p`
  font-size: 32px;
  font-weight: 500;
`;

const Denomination = styled.span`
  margin-left: 8px;
  font-size: 0.56em;
`;

const ChartWr = styled.div`
  width: 200px;
`;
