import {
  HorizontalGraphBar,
  Rect,
} from '@anchor-protocol/neumorphism-ui/components/HorizontalGraphBar';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { formatRateToPercentage } from '@anchor-protocol/notation';
import { Rate } from '@anchor-protocol/types';
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
}

const colorFunction = ({ color }: Data) => color;
const valueFunction = ({ value }: Data) => value;
const labelRenderer = ({ position, label, color }: Data, rect: Rect) => {
  return position === 'baseline' ? (
    <GraphTick style={{ left: rect.x + rect.width }}>&nbsp;</GraphTick>
  ) : null;
};

export function PollTinyGraph({
  total,
  yes,
  no,
  baseline,
  baselineLabel,
}: PollGraphProps) {
  const theme = useTheme();

  return (
    <HorizontalGraphBar<Data>
      min={0}
      max={total}
      barHeight={8}
      boxRadius={4}
      data={[
        {
          position: 'vote',
          label: `No ${formatRateToPercentage((no / total) as Rate<number>)}%`,
          color: no > 0 ? theme.colors.negative : 'transparent',
          value: yes + no,
        },
        {
          position: 'vote',
          label: `Yes ${formatRateToPercentage(
            (yes / total) as Rate<number>,
          )}%`,
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
      <TotalVoteSpan>
        {formatRateToPercentage(((yes + no) / total) as Rate<number>)}%
      </TotalVoteSpan>
      <YesNoSpan>
        <span className="yes">
          <b>Yes</b> {formatRateToPercentage((yes / total) as Rate<number>)}%
        </span>
        <span className="no">
          <b>No</b> {formatRateToPercentage((no / total) as Rate<number>)}%
        </span>
      </YesNoSpan>
    </HorizontalGraphBar>
  );
}

const TotalVoteSpan = styled(IconSpan)`
  left: 0;
  top: -27px;

  font-size: 16px;
`;

const YesNoSpan = styled.span`
  right: 0;
  top: -24px;

  font-size: 12px;

  .yes {
    color: ${({ theme }) => theme.colors.positive};
  }

  .no {
    color: ${({ theme }) => theme.colors.negative};
    margin-left: 10px;
  }
`;
