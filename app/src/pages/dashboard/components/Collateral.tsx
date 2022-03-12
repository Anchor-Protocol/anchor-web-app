import {
  useMarketBEthQuery,
  useMarketBLunaQuery,
  useMarketCollateralsQuery,
  useWhitelistCollateralQuery,
} from '@anchor-protocol/app-provider';
import { formatUTokenIntegerWithoutPostfixUnits } from '@anchor-protocol/notation';
import { bAsset, bLuna } from '@anchor-protocol/types';
import { formatRate } from '@libs/formatter';
import { Section } from '@libs/neumorphism-ui/components/Section';
import { u, UST, Rate } from '@libs/types';
import { AnimateNumber, UIElementProps } from '@libs/ui';
import big, { Big, BigSource } from 'big.js';
import { fixHMR } from 'fix-hmr';
import React, { useMemo } from 'react';
import { useTheme } from 'styled-components';
import { CollateralsChart } from './CollateralsChart';
import { CollateralTable } from './CollateralTable';
import { findPrevDay } from './internal/axisUtils';

function CollateralBase(props: UIElementProps) {
  const { className, isMobile } = props;

  const theme = useTheme();

  const { data: whitelistCollateral = [] } = useWhitelistCollateralQuery();
  const { data: marketBLuna } = useMarketBLunaQuery();
  const { data: marketBEth } = useMarketBEthQuery();
  const { data: marketCollaterals } = useMarketCollateralsQuery();

  const collaterals = useMemo(() => {
    if (
      !marketCollaterals ||
      !marketBLuna ||
      !marketBEth ||
      marketCollaterals.history.length === 0
    ) {
      return undefined;
    }

    const last = marketCollaterals.now;
    const last1DayBefore =
      marketCollaterals.history.find(findPrevDay(last.timestamp)) ??
      marketCollaterals.history[marketCollaterals.history.length - 2];

    const bLunaCollateral = last.collaterals.find(
      ({ symbol }) => symbol.toLowerCase() === 'bluna',
    );

    const bEthCollateral = last.collaterals.find(
      ({ symbol }) => symbol.toLowerCase() === 'beth',
    );

    return {
      mainTotalCollateralValue: last.total_value,
      totalCollateralValueGraph: 'TODO: API not ready...',
      totalCollateralDiff: big(
        big(last.total_value).minus(last1DayBefore.total_value),
      ).div(last1DayBefore.total_value) as Rate<Big>,
      totalCollateralValue: big(
        last.collaterals.reduce((total, { collateral, price }) => {
          return total.plus(big(collateral).mul(price));
        }, big(0)) as u<UST<Big>>,
      ).mul(marketBLuna.bLuna_price) as u<UST<Big>>,
      totalCollateralValueDiff: 'TODO: API not ready...',
      bLunaPrice: marketBLuna.bLuna_price,
      bLunaPriceDiff: 'TODO: API not ready...',
      bLunaTotalCollateral: (bLunaCollateral?.collateral ?? '0') as u<bLuna>,
      bLunaTotalCollateralValue: (bLunaCollateral
        ? big(bLunaCollateral.collateral).mul(bLunaCollateral.price)
        : '0') as u<UST<BigSource>>,
      bEthPrice: marketBEth.beth_price,
      bEthPriceDiff: 'TODO: API not ready...',
      bEthTotalCollateral: (bEthCollateral?.collateral ?? '0') as u<bAsset>,
      bEthTotalCollateralValue: (bEthCollateral
        ? big(bEthCollateral.collateral).mul(bEthCollateral.price)
        : '0') as u<UST<BigSource>>,
    };
  }, [marketBEth, marketBLuna, marketCollaterals]);

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

      <CollateralTable
        className="basset-market"
        whitelistCollateral={whitelistCollateral}
        collateralData={marketCollaterals}
      />
    </Section>
  );
}

export const Collateral = fixHMR(CollateralBase);
