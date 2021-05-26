import {
  demicrofy,
  formatRate,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { Rate, uUST } from '@anchor-protocol/types';
import { InfoOutlined } from '@material-ui/icons';
import {
  HorizontalGraphBar,
  Rect,
} from '@terra-dev/neumorphism-ui/components/HorizontalGraphBar';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@terra-dev/neumorphism-ui/components/InfoTooltip';
import { Tooltip } from '@terra-dev/neumorphism-ui/components/Tooltip';
import big, { Big, BigSource } from 'big.js';
import React, { useMemo } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useTheme } from 'styled-components';
import { GraphLabel } from './GraphLabel';
import { GraphMarkerTick } from './GraphMarkerTick';
import { GraphTick } from './GraphTick';

export interface Data {
  position: 'top' | 'top-marker' | 'bottom';
  label: string;
  value: number;
  color: string;
  textAlign?: 'left' | 'center' | 'right';
  tooltip?: string;
}

export interface BorrowLimitGraphProps {
  ltv: Rate<BigSource>;
  bLunaSafeLtv: Rate<BigSource>;
  bLunaMaxLtv: Rate<BigSource>;
  collateralValue: uUST<BigSource>;
  loanAmount: uUST<BigSource>;
}

const colorFunction = ({ color }: Data) => color;
const valueFunction = ({ value }: Data) => value;
const labelRenderer = (
  { position, label, tooltip, textAlign = 'center' }: Data,
  rect: Rect,
  i: number,
) => {
  return position === 'top' ? (
    <GraphTick
      key={'label' + i}
      style={{
        transform: `translateX(${rect.x + rect.width}px)`,
        opacity: label.length === 0 ? 0 : 1,
      }}
    >
      <span>
        {tooltip ? (
          <Tooltip title={tooltip} placement="top">
            <IconSpan style={{ cursor: 'help' }}>
              <sup>
                <InfoOutlined />
              </sup>{' '}
              {label}
            </IconSpan>
          </Tooltip>
        ) : (
          label
        )}
      </span>
    </GraphTick>
  ) : position === 'top-marker' ? (
    <GraphMarkerTick
      key={'label' + i}
      textAlign={textAlign}
      style={{
        transform: `translateX(${rect.x + rect.width}px)`,
        opacity: label.length === 0 ? 0 : 1,
      }}
    >
      <span>
        {tooltip ? (
          <Tooltip title={tooltip} placement="top">
            <IconSpan style={{ cursor: 'help', letterSpacing: '-0.5px' }}>
              <sup>
                <InfoOutlined />
              </sup>{' '}
              {label}
            </IconSpan>
          </Tooltip>
        ) : (
          label
        )}
      </span>
    </GraphMarkerTick>
  ) : (
    <GraphLabel key={'label' + i} style={{ left: rect.x + rect.width }}>
      {label}
    </GraphLabel>
  );
};

export function BorrowLimitGraph({
  ltv: _ltv,
  bLunaSafeLtv: _bLunaSafeLtv,
  bLunaMaxLtv: _bLunaMaxLtv,
  collateralValue,
  loanAmount,
}: BorrowLimitGraphProps) {
  const theme = useTheme();

  const isSmallScreen = useMediaQuery({ maxWidth: 700 });

  const { borrowLimit, ltv, bLunaMaxLtv, bLunaSafeLtv } = useMemo(() => {
    const ltv = big(_ltv) as Rate<Big>;
    const bLunaSafeLtv = big(_bLunaSafeLtv) as Rate<Big>;
    const bLunaMaxLtv = big(_bLunaMaxLtv) as Rate<Big>;
    const borrowLimit = big(collateralValue).mul(bLunaMaxLtv) as uUST<Big>;
    return {
      ltv,
      bLunaSafeLtv,
      bLunaMaxLtv,
      borrowLimit,
      //borrowLimitRate: big(1) as Rate<Big>,
      borrowLimitRate: !borrowLimit.eq(0)
        ? (big(loanAmount).div(borrowLimit) as Rate<Big>)
        : (big(0) as Rate<Big>),
    };
  }, [_bLunaMaxLtv, _bLunaSafeLtv, _ltv, collateralValue, loanAmount]);

  return (
    <HorizontalGraphBar<Data>
      min={0}
      max={bLunaMaxLtv.toNumber()}
      animate
      data={[
        {
          position: 'top-marker',
          label: `${formatRate(bLunaMaxLtv)}% LTV${
            isSmallScreen ? '' : ' (MAX)'
          }`,
          color: 'rgba(0, 0, 0, 0)',
          textAlign: 'right',
          value: big(bLunaMaxLtv).toNumber(),
          tooltip:
            'Maximum allowed loan to value (LTV) ratio, collaterals will be liquidated when the LTV is bigger than this value.',
        },
        {
          position: 'top-marker',
          label: `${formatRate(bLunaSafeLtv)}% LTV`,
          color: 'rgba(0, 0, 0, 0)',
          textAlign: 'right',
          value: big(bLunaSafeLtv).toNumber(),
          tooltip: 'Recommended LTV',
        },
        ltv.gt(0)
          ? {
              position: 'top',
              label: `${formatRate(ltv)}%`,
              color: ltv.gte(0.4)
                ? theme.colors.negative
                : ltv.gte(bLunaSafeLtv)
                ? theme.colors.warning
                : theme.colors.positive,
              value: ltv.toNumber(),
              tooltip: ltv.gte(bLunaMaxLtv)
                ? "Loan can be liquidated anytime upon another user's request. Repay loans with stablecoins or deposit more collateral to prevent liquidation."
                : ltv.gte(bLunaSafeLtv)
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
