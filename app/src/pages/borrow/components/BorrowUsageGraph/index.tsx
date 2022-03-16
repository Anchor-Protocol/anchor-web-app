import { formatUSTWithPostfixUnits } from '@anchor-protocol/notation';
import { Rate, u, UST } from '@anchor-protocol/types';
import { demicrofy, formatRate } from '@libs/formatter';
import { HorizontalGraphBar } from '@libs/neumorphism-ui/components/HorizontalGraphBar';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import big, { Big, BigSource } from 'big.js';
import React from 'react';
import { useTheme } from 'styled-components';
import { Footnote } from './Footnote';
import {
  colorFunction,
  labelRenderer,
  RenderData,
  valueFunction,
} from './render';
import { ANCHOR_SAFE_RATIO } from '@anchor-protocol/app-fns';

export interface BorrowUsageGraphProps {
  currentLtv: Rate<Big>;
  borrowLimit: u<UST<Big>>;
}

export function BorrowUsageGraph(props: BorrowUsageGraphProps) {
  const theme = useTheme();

  const { currentLtv, borrowLimit } = props;

  const data: RenderData[] = [
    {
      variant: 'marker',
      label: `${formatRate(ANCHOR_SAFE_RATIO)}%`,
      color: 'rgba(0, 0, 0, 0)',
      textAlign: 'center',
      value: ANCHOR_SAFE_RATIO,
      tooltip: 'Recommended borrow usage',
    },
    {
      variant: 'marker',
      label: `100%`,
      color: 'rgba(0, 0, 0, 0)',
      textAlign: 'center',
      value: 1,
      tooltip:
        'When the borrow usage reaches 100%, liquidations can occur at anytime',
    },
    big(currentLtv).gt(0)
      ? {
          variant: 'label',
          label: `${formatRate(currentLtv as Rate<BigSource>)}%`,
          color: currentLtv.gte(0.9)
            ? theme.colors.negative
            : currentLtv.gte(ANCHOR_SAFE_RATIO)
            ? theme.colors.warning
            : theme.colors.primary,
          value: currentLtv.toNumber(),
          tooltip: undefined,
        }
      : {
          variant: 'label',
          label: '',
          color: theme.colors.primary,
          value: 0,
          tooltip: undefined,
        },
  ];

  return (
    <HorizontalGraphBar<RenderData>
      min={0}
      max={1}
      animate
      data={data}
      colorFunction={colorFunction}
      valueFunction={valueFunction}
      labelRenderer={labelRenderer}
    >
      <Footnote style={{ right: 0 }}>
        <IconSpan>
          Borrow Limit: ${formatUSTWithPostfixUnits(demicrofy(borrowLimit))}{' '}
          <InfoTooltip>
            The maximum amount of liability permitted from deposited collaterals
          </InfoTooltip>
        </IconSpan>
      </Footnote>
    </HorizontalGraphBar>
  );
}
