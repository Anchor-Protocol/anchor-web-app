import { Wallet } from '@anchor-protocol/icons';
import { UIElementProps } from '@libs/ui';
import React from 'react';
import styled, { keyframes } from 'styled-components';

export interface ConnectionIconsProps extends UIElementProps {
  name: string;
  readonly: boolean;
  icon: string;
}

function ConnectionIconsBase(props: ConnectionIconsProps) {
  const { className, name, readonly, icon } = props;
  return (
    <div className={className}>
      {readonly ? (
        <Icon>
          <Wallet />
        </Icon>
      ) : (
        <>
          <Description>{name}</Description>
          <Icon>
            <Wallet />
          </Icon>
          <Line />
          <Icon>
            <img src={icon} alt={name} />
          </Icon>
        </>
      )}
    </div>
  );
}

export const ConnectionIcons = styled(ConnectionIconsBase)`
  display: flex;
  justify-content: space-between;
  align-items: center;

  position: relative;

  img {
    width: 16px;
    height: 16px;
  }
`;

const Description = styled.span`
  position: absolute;

  top: -10px;
  left: 50%;
  transform: translateX(-50%);

  word-break: keep-all;
  white-space: nowrap;

  font-size: 9px;
  color: ${({ theme }) => theme.colors.positive};

  text-transform: uppercase;
`;

const Icon = styled.div`
  width: 38px;
  height: 38px;
  background-color: ${({ theme }) =>
    theme.palette.type === 'dark' ? 'black' : '#2c2c2c'};
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.positive};

  display: grid;
  place-content: center;

  svg {
    font-size: 16px;
  }
`;

const lineWidth = 120;
const lineHeight = 35;

function LineBase({ className }: { className?: string }) {
  return (
    <svg width={lineWidth} height={lineHeight} className={className}>
      <line x1={0} x2={lineWidth} y1={lineHeight / 2} y2={lineHeight / 2} />
      <circle cx={lineWidth / 2} cy={lineHeight / 2} r={9} />
      <g
        transform={`translate(${lineWidth / 2 - 6} ${
          lineHeight / 2 - 6
        }) scale(0.5)`}
      >
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
      </g>
    </svg>
  );
}

const dash = keyframes`
  to {
    stroke-dashoffset: 0;
  }
`;

const Line = styled(LineBase)`
  line {
    stroke: ${({ theme }) => theme.colors.positive};
    stroke-dasharray: 2, 4;
    stroke-dashoffset: 300;
    animation: ${dash} 10s linear infinite;
  }

  circle {
    fill: ${({ theme }) =>
      theme.palette.type === 'light' ? '#ffffff' : '#363c5f'};
    stroke: ${({ theme }) => theme.colors.positive};
    stroke-width: 1px;
  }

  g {
    path {
      fill: ${({ theme }) => theme.colors.positive};
    }
  }
`;
