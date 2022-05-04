/* eslint-disable @typescript-eslint/no-unused-vars */
// WIP
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { BoundingBoxAware } from '../boundingBox/BoundingBoxAware';

export interface NestedPieChartData {
  color: string;
  value: number;
}

interface NestedPieChartProps {
  data: NestedPieChartData[];
}

const pieChartWidthInPx = 33;

const getCoordFromDegrees = (
  angle: number,
  radius: number,
  svgSize: number,
) => {
  const x = Math.cos((angle * Math.PI) / 180);
  const y = Math.sin((angle * Math.PI) / 180);
  const coordX = x * radius + svgSize / 2;
  const coordY = y * -radius + svgSize / 2;

  return {
    x: coordX,
    y: coordY,
  };
};

export const NestedPieChart = ({ data }: NestedPieChartProps) => {
  const total = useMemo(
    () => Math.max(...data.map((data) => data.value)),
    [data],
  );

  return (
    <BoundingBoxAware
      render={({ setElement, boundingBox }) => {
        const renderContent = () => {
          if (!boundingBox) {
            return null;
          }

          const { width, height } = boundingBox;
          const size = Math.min(width, height);
          const radius = size / 2;

          return (
            <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
              {data
                .sort((a, b) => b.value - a.value)
                .map(({ value, color }, index) => {
                  if (index === 0) {
                    return (
                      <circle
                        stroke={color}
                        stroke-width={pieChartWidthInPx}
                        fill="transparent"
                        r={radius - pieChartWidthInPx / 2}
                        cx={radius}
                        cy={radius}
                      />
                    );
                  }
                  return null;
                })}
            </svg>
          );
        };

        return <Container ref={setElement}>{renderContent()}</Container>;
      }}
    />
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 100%;
  width: 100%;
`;
