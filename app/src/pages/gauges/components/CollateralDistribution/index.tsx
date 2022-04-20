import { formatUTokenIntegerWithoutPostfixUnits } from '@anchor-protocol/notation';
import { Token, u } from '@libs/types';
import { AnimateNumber } from '@libs/ui';
import Big, { BigSource } from 'big.js';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { sum } from '@libs/big-math';
import { getPaletteColor } from '@libs/ui/colors/palette';
import { colorToCSSValue } from '@libs/ui/colors/colorToCSSValue';
import { DoughnutChart } from 'pages/dashboard/components/DoughnutChart';
import { HStack, VStack } from '@libs/ui/Stack';
import { CollateralInfo } from './CollateralInfo';

const collateral = [
  {
    symbol: 'bLUNA',
    value: Big('6789069442123'),
  },
  {
    symbol: 'bETH',
    value: Big('2789069442123'),
  },
  {
    symbol: 'bATOM',
    value: Big('1789069442123'),
  },
  {
    symbol: 'wasAVAX',
    value: Big('1189069442123'),
  },
];

export const CollateralDistribution = () => {
  const totalValueLocked = useMemo(
    () => sum(...collateral.map((c) => c.value)),
    [],
  );

  const descriptors = useMemo(
    () =>
      collateral.map(({ symbol, value }, index) => ({
        label: symbol,
        color: colorToCSSValue(getPaletteColor(index)),
        value: value.toNumber(),
      })),
    [],
  );

  return (
    <VStack gap={40}>
      <div>
        <h2>TOTAL STAKED</h2>
        <Amount>
          <AnimateNumber format={formatUTokenIntegerWithoutPostfixUnits}>
            {(totalValueLocked || 0) as u<Token<BigSource>>}
          </AnimateNumber>
          <Denomination>veANC</Denomination>
        </Amount>
      </div>
      <HStack alignItems="center" gap={40}>
        <ChartWr>
          <DoughnutChart descriptors={descriptors} />
        </ChartWr>
        <VStack gap={20}>
          {collateral.map(({ symbol, value }, index) => (
            <CollateralInfo
              key={symbol}
              color={getPaletteColor(index)}
              name={symbol}
              amount={value as u<Token<BigSource>>}
              share={value.div(totalValueLocked).toNumber()}
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
