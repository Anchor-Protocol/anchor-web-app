import {
  demicrofy,
  formatRate,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { Rate, uUST } from '@anchor-protocol/types';
import { HorizontalGraphBar } from '@packages/neumorphism-ui/components/HorizontalGraphBar';
import { IconSpan } from '@packages/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@packages/neumorphism-ui/components/InfoTooltip';
import big, { Big, BigSource } from 'big.js';
import React, { useMemo } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useTheme } from 'styled-components';
import { GraphLabel } from './GraphLabel';
import {
  colorFunction,
  labelRenderer,
  RenderData,
  valueFunction,
} from './render';

export interface BorrowLimitGraphProps {
  currentLtv: Rate<BigSource>;
  safeLtv: Rate<BigSource>;
  maxLtv: Rate<BigSource>;
  dangerLtv: Rate<BigSource>;
  borrowLimit: uUST<BigSource>;
}

export function BorrowLimitGraph({
  currentLtv: _currentLtv,
  safeLtv: _safeLtv,
  maxLtv: _maxLtv,
  dangerLtv: _dangerLtv,
  borrowLimit,
}: BorrowLimitGraphProps) {
  const theme = useTheme();

  const isSmallScreen = useMediaQuery({ maxWidth: 700 });

  const { currentLtv, safeLtv, maxLtv, dangerLtv } = useMemo(() => {
    return {
      currentLtv: big(_currentLtv) as Rate<Big>,
      safeLtv: big(_safeLtv) as Rate<Big>,
      maxLtv: big(_maxLtv) as Rate<Big>,
      dangerLtv: big(_dangerLtv) as Rate<Big>,
    };
  }, [_currentLtv, _dangerLtv, _maxLtv, _safeLtv]);

  return (
    <HorizontalGraphBar<RenderData>
      min={0}
      max={maxLtv.toNumber()}
      animate
      data={[
        {
          position: 'top-marker',
          label: `${formatRate(maxLtv)}% LTV${isSmallScreen ? '' : ' (MAX)'}`,
          color: 'rgba(0, 0, 0, 0)',
          textAlign: 'right',
          value: maxLtv.toNumber(),
          tooltip:
            'Maximum allowed loan to value (LTV) ratio, collaterals will be liquidated when the LTV is bigger than this value.',
        },
        {
          position: 'top-marker',
          label: `${formatRate(safeLtv)}% LTV`,
          color: 'rgba(0, 0, 0, 0)',
          textAlign: 'right',
          value: big(safeLtv).toNumber(),
          tooltip: 'Recommended LTV',
        },
        currentLtv.gt(0)
          ? {
              position: 'top',
              label: `${formatRate(currentLtv)}%`,
              color: currentLtv.gte(dangerLtv)
                ? theme.colors.negative
                : currentLtv.gte(safeLtv)
                ? theme.colors.warning
                : theme.colors.positive,
              value: currentLtv.toNumber(),
              tooltip: currentLtv.gte(maxLtv)
                ? "Loan can be liquidated anytime upon another user's request. Repay loans with stablecoins or deposit more collateral to prevent liquidation."
                : currentLtv.gte(safeLtv)
                ? 'Loan is close to liquidation. Repay loan with stablecoins or deposit more collateral.'
                : undefined,
            }
          : {
              position: 'top',
              label: '',
              color: theme.colors.positive,
              value: 0,
              tooltip: undefined,
            },
      ]}
      colorFunction={colorFunction}
      valueFunction={valueFunction}
      labelRenderer={labelRenderer}
    >
      <GraphLabel style={{ left: 0 }}>
        <IconSpan>
          LTV <InfoTooltip>Loan-to-value ratio</InfoTooltip>
        </IconSpan>
      </GraphLabel>
      <GraphLabel style={{ right: 0 }}>
        <IconSpan>
          Borrow Limit: ${formatUSTWithPostfixUnits(demicrofy(borrowLimit))}{' '}
          <InfoTooltip>
            The maximum amount of liability permitted from deposited collaterals
          </InfoTooltip>
        </IconSpan>
      </GraphLabel>
    </HorizontalGraphBar>
  );
}
