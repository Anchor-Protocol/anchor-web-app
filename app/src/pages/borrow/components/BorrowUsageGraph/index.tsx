import { formatUSTWithPostfixUnits } from '@anchor-protocol/notation';
import { Rate, u, UST } from '@anchor-protocol/types';
import { demicrofy, formatRate } from '@libs/formatter';
import { HorizontalGraphBar } from '@libs/neumorphism-ui/components/HorizontalGraphBar';
import { HorizontalGraphSliderThumb } from '@libs/neumorphism-ui/components/HorizontalGraphSlider';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import big, { BigSource } from 'big.js';
import React from 'react';
import { Rect } from './HorizontalGraphBar';
import styled, { useTheme } from 'styled-components';
import { FootnoteLabel } from './FootnoteLabel';
import {
  colorFunction,
  labelRenderer,
  RenderData,
  valueFunction,
} from './render';
import {
  ANCHOR_SAFE_RATIO,
  ANCHOR_DANGER_RATIO,
} from '@anchor-protocol/app-fns';

export interface BorrowUsageGraphProps {
  borrowedValue: u<UST<BigSource>>;
  borrowLimit: u<UST<BigSource>>;
}

export function BorrowUsageGraph(props: BorrowUsageGraphProps) {
  const theme = useTheme();

  const { borrowedValue, borrowLimit } = props;

  const borrowRatio = big(borrowedValue).div(borrowLimit);

  const data: RenderData[] = [
    {
      variant: 'marker',
      label: `${formatRate(ANCHOR_SAFE_RATIO)}%`,
      color: 'rgba(0, 0, 0, 0)',
      textAlign: 'center',
      value: big(ANCHOR_SAFE_RATIO).mul(100).toNumber(),
      tooltip: 'Recommended LTV',
    },
    {
      variant: 'marker',
      label: `100%`,
      color: 'rgba(0, 0, 0, 0)',
      textAlign: 'center',
      value: big(100).toNumber(),
      tooltip: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    big(borrowedValue).gt(0)
      ? {
          variant: 'label',
          label: `${formatRate(borrowRatio as Rate<BigSource>)}%`,
          color: borrowRatio.gte(ANCHOR_DANGER_RATIO)
            ? theme.colors.negative
            : borrowRatio.gte(ANCHOR_SAFE_RATIO)
            ? theme.colors.warning
            : theme.colors.positive,
          value: borrowRatio.mul(100).toNumber(),
          tooltip: undefined,
        }
      : {
          variant: 'label',
          label: '',
          color: theme.colors.positive,
          value: 0,
          tooltip: undefined,
        },
  ];

  return (
    <HorizontalGraphBar<RenderData>
      min={0}
      max={100}
      animate
      data={data}
      colorFunction={colorFunction}
      valueFunction={valueFunction}
      labelRenderer={labelRenderer}
    >
      {({ coordinateSpace, min, max }) => {
        const value = borrowRatio.mul(100).toNumber();
        const position = Math.max(
          Math.min(
            ((value - min) / (max - min)) * coordinateSpace.width,
            coordinateSpace.width,
          ),
          0,
        );
        return (
          <>
            <ThumbContainer
              coordinateSpace={coordinateSpace}
              position={position}
            />
            <FootnoteLabel style={{ right: 0 }}>
              <IconSpan>
                Borrow Limit: $
                {formatUSTWithPostfixUnits(demicrofy(borrowLimit))}{' '}
                <InfoTooltip>
                  The maximum amount of liability permitted from deposited
                  collaterals
                </InfoTooltip>
              </IconSpan>
            </FootnoteLabel>
          </>
        );
      }}
    </HorizontalGraphBar>
  );
}

const ThumbContainerBase = ({
  className,
  position,
}: {
  className?: string;
  coordinateSpace: Rect;
  position: number;
}) => {
  return (
    <div className={className}>
      <div style={{ left: position }}>
        <HorizontalGraphSliderThumb />
      </div>
    </div>
  );
};

const ThumbContainer = styled(ThumbContainerBase)`
  position: absolute;

  left: ${({ coordinateSpace }) => coordinateSpace.x}px;
  top: ${({ coordinateSpace }) => coordinateSpace.y}px;
  width: ${({ coordinateSpace }) => coordinateSpace.width}px;
  height: ${({ coordinateSpace }) => coordinateSpace.height}px;

  > :first-child {
    width: ${({ coordinateSpace }) => coordinateSpace.height}px;
    height: ${({ coordinateSpace }) => coordinateSpace.height}px;
    transform: translateX(
      -${({ coordinateSpace }) => coordinateSpace.height / 2}px
    );

    position: absolute;
    display: grid;
    place-content: center;
  }
`;
