import { formatUTokenIntegerWithoutPostfixUnits } from '@anchor-protocol/notation';
import { Token, u } from '@libs/types';
import { AnimateNumber } from '@libs/ui';
import Big, { BigSource } from 'big.js';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { DoughnutChart } from 'pages/dashboard/components/DoughnutChart';
import { HStack, VStack } from '@libs/ui/Stack';
import { CollateralInfo } from './CollateralInfo';
import { useCollateralGaugesQuery } from 'queries/gov/useCollateralGaugesQuery';
import { useTheme } from 'styled-components';
import { VEANC_SYMBOL } from '@anchor-protocol/token-symbols';
import { sum } from '@libs/big-math';

const MAX_DISTRIBUTION_ITEMS = 10;

interface DistributionItem {
  color: string;
  name: string;
  amount: u<Token<BigSource>>;
  share: number;
}

export const CollateralDistribution = () => {
  const {
    data: { collateral, totalVotes } = { collateral: [], totalVotes: 0 },
  } = useCollateralGaugesQuery();

  const theme = useTheme();

  const distribution: DistributionItem[] = useMemo(() => {
    let distributionItems: DistributionItem[] = collateral
      .slice(0, MAX_DISTRIBUTION_ITEMS)
      .map(({ symbol, votes, share }, index) => ({
        color: theme.chart[index % theme.chart.length],
        name: symbol,
        amount: votes,
        share,
      }));

    if (collateral.length > MAX_DISTRIBUTION_ITEMS) {
      const otherCollateralIndex = MAX_DISTRIBUTION_ITEMS - 1;

      const unincludedCollateral = collateral.slice(MAX_DISTRIBUTION_ITEMS - 1);
      const otherCollateral: DistributionItem = {
        color: distributionItems[otherCollateralIndex].color,
        name: 'Other',
        amount: sum(...unincludedCollateral.map(({ votes }) => votes)) as u<
          Token<BigSource>
        >,
        share: sum(
          ...unincludedCollateral.map(({ share }) => share),
        ).toNumber(),
      };
      distributionItems[otherCollateralIndex] = otherCollateral;
    }

    return distributionItems;
  }, [collateral, theme.chart]);

  const descriptors = useMemo(
    () =>
      distribution.map(({ amount, name, color }) => ({
        label: name,
        color: color,
        value: Big(amount).toNumber(),
      })),
    [distribution],
  );

  return (
    <VStack gap={40}>
      <div>
        <h2>TOTAL VOTES</h2>
        <Amount>
          <AnimateNumber format={formatUTokenIntegerWithoutPostfixUnits}>
            {(totalVotes || 0) as u<Token<BigSource>>}
          </AnimateNumber>
          <Denomination>{VEANC_SYMBOL}</Denomination>
        </Amount>
      </div>
      <HStack alignItems="center" gap={40}>
        <ChartWr>
          <DoughnutChart descriptors={descriptors} />
        </ChartWr>
        <DistributionList>
          {distribution.map(({ color, name, amount, share }) => (
            <CollateralInfo
              key={name}
              color={color}
              name={name}
              amount={amount}
              share={share}
            />
          ))}
        </DistributionList>
      </HStack>
    </VStack>
  );
};

const DistributionList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 40px;
`;

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
