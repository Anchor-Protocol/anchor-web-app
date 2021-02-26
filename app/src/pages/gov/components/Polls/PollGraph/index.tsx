import {
  HorizontalGraphBar,
  Rect,
} from '@anchor-protocol/neumorphism-ui/components/HorizontalGraphBar';
import { IconSpan } from '@anchor-protocol/neumorphism-ui/components/IconSpan';
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
  displaySpans = true,
}: PollGraphProps) {
  return (
    <HorizontalGraphBar<Data>
      min={0}
      max={total}
      data={[
        {
          position: 'vote',
          label: `No ${Math.floor((no / total) * 100)}%`,
          color: '#e95979',
          value: yes + no,
        },
        {
          position: 'vote',
          label: `Yes ${Math.floor((yes / total) * 100)}%`,
          color: '#15cc93',
          value: yes,
        },
        {
          position: 'baseline',
          label: 'Pass Threshold',
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
          <b>Voted</b> {Math.floor(((yes + no) / total) * 100)}%
        </TotalVoteSpan>
      )}
      {displaySpans && (
        <YesNoSpan>
          <span className="yes">
            <b>Yes</b> {Math.floor((yes / total) * 100)}%
          </span>
          <span className="no">
            <b>No</b> {Math.floor((no / total) * 100)}%
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
