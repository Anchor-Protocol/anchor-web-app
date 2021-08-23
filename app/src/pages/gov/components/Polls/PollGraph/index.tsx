import { Rate } from '@anchor-protocol/types';
import { formatRate } from '@libs/formatter';
import {
  HorizontalGraphBar,
  Rect,
} from '@libs/neumorphism-ui/components/HorizontalGraphBar';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import React from 'react';
import styled, { useTheme } from 'styled-components';
import { GraphTick } from './GraphTick';

export interface Data {
  position: 'baseline' | 'vote';
  label: string;
  value: number;
  color: string;
}

export interface PollGraphProps {
  total: number;
  yes: number;
  no: number;
  baseline: number;
  baselineLabel: string;
  displaySpans?: boolean;
}

const colorFunction = ({ color }: Data) => color;
const valueFunction = ({ value }: Data) => value;
const labelRenderer = (
  { position, label, color }: Data,
  rect: Rect,
  i: number,
) => {
  return position === 'baseline' ? (
    <GraphTick key={'label' + i} style={{ left: rect.x + rect.width }}>
      {label}
    </GraphTick>
  ) : null;
};

export function PollGraph({
  total,
  yes,
  no,
  baseline,
  baselineLabel,
  displaySpans = true,
}: PollGraphProps) {
  const theme = useTheme();

  return (
    <HorizontalGraphBar<Data>
      min={0}
      max={total}
      data={[
        {
          position: 'vote',
          label: `No ${formatRate((no / total) as Rate<number>)}%`,
          color: no > 0 ? theme.colors.negative : 'transparent',
          value: yes + no,
        },
        {
          position: 'vote',
          label: `Yes ${formatRate((yes / total) as Rate<number>)}%`,
          color: theme.colors.positive,
          value: yes,
        },
        {
          position: 'baseline',
          label: baselineLabel,
          color: 'transparent',
          value: baseline,
        },
      ]}
      colorFunction={colorFunction}
      valueFunction={valueFunction}
      labelRenderer={labelRenderer}
    >
      {displaySpans && (
        <TotalVoteSpan>
          <b>Voted</b> {formatRate(((yes + no) / total) as Rate<number>)}%
        </TotalVoteSpan>
      )}
      {displaySpans && (
        <YesNoSpan>
          <span className="yes">
            <b>Yes</b> {formatRate((yes / total) as Rate<number>)}%
          </span>
          <span className="no">
            <b>No</b> {formatRate((no / total) as Rate<number>)}%
          </span>
        </YesNoSpan>
      )}
    </HorizontalGraphBar>
  );
}

const TotalVoteSpan = styled(IconSpan)`
  left: 0;
  top: 20px;

  font-size: 12px;
`;

const YesNoSpan = styled.span`
  right: 0;
  top: 20px;

  font-size: 12px;

  .yes {
    color: ${({ theme }) => theme.colors.positive};
  }

  .no {
    color: ${({ theme }) => theme.colors.negative};
    margin-left: 10px;
  }
`;
