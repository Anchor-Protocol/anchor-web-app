import {
  useMarketCollateralsQuery,
  useWhitelistCollateralQuery,
} from '@anchor-protocol/app-provider';
import { formatUTokenIntegerWithoutPostfixUnits } from '@anchor-protocol/notation';
import { formatRate } from '@libs/formatter';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { u, UST, Rate } from '@libs/types';
import { AnimateNumber, UIElementProps } from '@libs/ui';
import big, { Big } from 'big.js';
import { fixHMR } from 'fix-hmr';
import React, { useMemo } from 'react';
import { useTheme } from 'styled-components';
import { CollateralsChart } from './CollateralsChart';
import { CollateralMarketTable } from './CollateralMarketTable';
import { findPrevDay } from './internal/axisUtils';

function CollateralMarketBase(props: UIElementProps) {
  const { className, isMobile } = props;

  const theme = useTheme();

  const { data: whitelistCollateral = [] } = useWhitelistCollateralQuery();
  const { data: marketCollaterals } = useMarketCollateralsQuery();

  const collaterals = useMemo(() => {
    if (!marketCollaterals || marketCollaterals.history.length === 0) {
      return undefined;
    }

    const last = marketCollaterals.now;
    const last1DayBefore =
      marketCollaterals.history.find(findPrevDay(last.timestamp)) ??
      marketCollaterals.history[marketCollaterals.history.length - 2];

    return {
      mainTotalCollateralValue: last.total_value,

      totalCollateralDiff: big(
        big(last.total_value).minus(last1DayBefore.total_value),
      ).div(last1DayBefore.total_value) as Rate<Big>,
    };
  }, [marketCollaterals]);

  return (
    <Section className={className}>
      <header>
        <div>
          <h2>
            TOTAL COLLATERAL VALUE
            {collaterals && (
              <span data-negative={big(collaterals.totalCollateralDiff).lt(0)}>
                {big(collaterals.totalCollateralDiff).gte(0) ? '+' : ''}
                {formatRate(collaterals.totalCollateralDiff)}%
              </span>
            )}
          </h2>
          <p className="amount">
            <AnimateNumber format={formatUTokenIntegerWithoutPostfixUnits}>
              {collaterals
                ? collaterals.mainTotalCollateralValue
                : (0 as u<UST<number>>)}
            </AnimateNumber>
            <span> UST</span>
          </p>
        </div>
      </header>

      <figure>
        <div>
          <CollateralsChart
            data={marketCollaterals?.history ?? []}
            theme={theme}
            isMobile={isMobile ?? false}
          />
        </div>
      </figure>

      <CollateralMarketTable
        className="basset-market"
        whitelistCollateral={whitelistCollateral}
        marketData={marketCollaterals?.now}
      />
    </Section>
  );
}

export const CollateralMarket = fixHMR(CollateralMarketBase);
