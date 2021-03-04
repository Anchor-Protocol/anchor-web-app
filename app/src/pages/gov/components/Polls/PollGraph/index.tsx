import {
  HorizontalGraphBar,
  Rect,
} from '@anchor-protocol/neumorphism-ui/components/HorizontalGraphBar';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
import { formatRateToPercentage } from '@anchor-protocol/notation';
import { Rate } from '@anchor-protocol/types';
import React from 'react';
import styled from 'styled-components';
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
const labelRenderer = ({ position, label, color }: Data, rect: Rect) => {
  return position === 'baseline' ? (
    <GraphTick style={{ left: rect.x + rect.width }}>{label}</GraphTick>
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
  return (
    <HorizontalGraphBar<Data>
      min={0}
      max={total}
      data={[
        {
          position: 'vote',
          label: `No ${formatRateToPercentage((no / total) as Rate<number>)}%`,
          color: no > 0 ? '#e95979' : 'transparent',
          value: yes + no,
        },
        {
          position: 'vote',
          label: `Yes ${formatRateToPercentage(
            (yes / total) as Rate<number>,
          )}%`,
          color: '#15cc93',
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
          <b>Voted</b>{' '}
          {formatRateToPercentage(((yes + no) / total) as Rate<number>)}%
        </TotalVoteSpan>
      )}
      {displaySpans && (
        <YesNoSpan>
          <span className="yes">
            <b>Yes</b> {formatRateToPercentage((yes / total) as Rate<number>)}%
          </span>
          <span className="no">
            <b>No</b> {formatRateToPercentage((no / total) as Rate<number>)}%
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
    color: #15cc93;
  }

  .no {
    color: #e95979;
    margin-left: 10px;
  }
`;
