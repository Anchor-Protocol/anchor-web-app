import { formatUSTWithPostfixUnits } from '@anchor-protocol/notation';
import { u, UST } from '@anchor-protocol/types';
import { demicrofy } from '@libs/formatter';
import { HorizontalGraphBar } from '@libs/neumorphism-ui/components/HorizontalGraphBar';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import big from 'big.js';
import { UIElementProps } from 'components/layouts/UIElementProps';
import { fixHMR } from 'fix-hmr';
import React from 'react';
// import { useMediaQuery } from 'react-responsive';
import styled from 'styled-components';
import { GraphLabel } from './GraphLabel';
import {
  colorFunction,
  labelRenderer,
  RenderData,
  valueFunction,
} from './render';

function BorrowUsageGraphBase({ className }: UIElementProps) {
  const borrowLimit = '1234567890' as u<UST>;

  const data: RenderData[] = [
    // {
    //   position: 'top-marker',
    //   label: `${formatRate(maxLtv)}% LTV${isSmallScreen ? '' : ' (MAX)'}`,
    //   color: 'rgba(0, 0, 0, 0)',
    //   textAlign: 'right',
    //   value: maxLtv.toNumber(),
    //   tooltip:
    //     'Maximum allowed loan to value (LTV) ratio, collaterals will be liquidated when the LTV is bigger than this value.',
    // },
    // {
    //   position: 'top-marker',
    //   label: `${formatRate(safeLtv)}% LTV`,
    //   color: 'rgba(0, 0, 0, 0)',
    //   textAlign: 'right',
    //   value: big(safeLtv).toNumber(),
    //   tooltip: 'Recommended LTV',
    // }

    {
      position: 'top-marker',
      label: `75%`,
      color: 'rgba(0, 0, 0, 0)',
      textAlign: 'center',
      value: big(75).toNumber(),
      tooltip: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      position: 'top-marker',
      label: `100%`,
      color: 'rgba(0, 0, 0, 0)',
      textAlign: 'right',
      value: big(100).toNumber(),
      tooltip: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      position: 'top',
      label: '',
      color: 'red',
      value: 30,
      tooltip: undefined,
    },
  ];

  return (
    <div className={className}>
      <h3>
        <IconSpan>
          BORROW USAGE{' '}
          <InfoTooltip>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </InfoTooltip>
        </IconSpan>
      </h3>
      <HorizontalGraphBar<RenderData>
        min={0}
        max={100}
        animate
        data={data}
        colorFunction={colorFunction}
        valueFunction={valueFunction}
        labelRenderer={labelRenderer}
      >
        <GraphLabel style={{ right: 0 }}>
          <IconSpan>
            Borrow Limit: ${formatUSTWithPostfixUnits(demicrofy(borrowLimit))}{' '}
            <InfoTooltip>
              The maximum amount of liability permitted from deposited
              collaterals
            </InfoTooltip>
          </IconSpan>
        </GraphLabel>
      </HorizontalGraphBar>
    </div>
  );
}

const StyledComponent = styled(BorrowUsageGraphBase)`
  h3 {
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 12px;
  }
`;

export const BorrowUsageGraph = fixHMR(StyledComponent);
