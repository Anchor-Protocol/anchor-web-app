import React, { useMemo } from 'react';
import styled from 'styled-components';
import { BoundingBoxAware } from '../../boundingBox/BoundingBoxAware';
import { SvgArc } from './SvgArc';
import { SvgDisk } from './SvgDisk';

export interface NestedPieChartData {
  color: string;
  value: number;
}

interface NestedPieChartProps {
  data: NestedPieChartData[];
}

const pieChartWidthInPx = 33;
const pieChartWidthDecrementInPx = 7;

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

          return (
            <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
              {data
                .sort((a, b) => b.value - a.value)
                .map(({ value, color }, index) => {
                  const widthDecrement = pieChartWidthDecrementInPx * index;
                  const radius = size / 2 - widthDecrement;
                  const transform = `translate(${widthDecrement},${widthDecrement})`;

                  if (value === 0) {
                    return null;
                  }

                  if (value === total) {
                    return (
                      <SvgDisk
                        key={index}
                        color={color}
                        width={pieChartWidthInPx}
                        radius={radius}
                        transform={transform}
                      />
                    );
                  }

                  return (
                    <SvgArc
                      key={index}
                      color={color}
                      width={pieChartWidthInPx - widthDecrement}
                      radius={radius}
                      share={value / total}
                      transform={transform}
                    />
                  );
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
