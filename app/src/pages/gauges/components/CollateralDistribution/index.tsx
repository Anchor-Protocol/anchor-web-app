import { Token, u } from '@libs/types';
import Big, { BigSource } from 'big.js';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { HStack, VStack } from '@libs/ui/Stack';
import { CollateralInfo } from './CollateralInfo';
import { useCollateralGaugeQuery } from 'queries/gov/useCollateralGaugeQuery';
import { useTheme } from 'styled-components';
import { VEANC_SYMBOL } from '@anchor-protocol/token-symbols';
import { sum } from '@libs/big-math';
import { AmountTitle } from '../AmountTitle';
import { DoughnutChart } from 'pages/mypage/components/graphics/DoughnutGraph';

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
  } = useCollateralGaugeQuery();

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

  const data = useMemo(
    () =>
      distribution.map(({ amount, name, color }) => ({
        label: name,
        color: color,
        value: Big(amount).toNumber(),
      })),
    [distribution],
  );

  const [focusedIndex, setFocusedIndex] = useState<number | undefined>();

  return (
    <VStack gap={40}>
      <AmountTitle
        title="TOTAL VOTES"
        amount={(totalVotes || 0) as u<Token<BigSource>>}
        symbol={VEANC_SYMBOL}
      />
      <HStack gap={40}>
        <ChartWr>
          <DoughnutChart onFocus={setFocusedIndex} data={data} />
        </ChartWr>
        <DistributionList>
          {distribution.map(({ color, name, amount, share }, index) => (
            <CollateralInfo
              key={name}
              color={color}
              name={name}
              amount={amount}
              share={share}
              isFocused={index === focusedIndex}
            />
          ))}
        </DistributionList>
      </HStack>
    </VStack>
  );
};
const DistributionList = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 20px 40px;
  align-items: start;
`;

const ChartWr = styled.div`
  height: 240px;
  width: 240px;
`;
