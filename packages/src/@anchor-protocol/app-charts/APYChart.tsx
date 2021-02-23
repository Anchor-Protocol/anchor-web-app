import { ChartSliderThumb } from '@anchor-protocol/app-charts/ChartSliderThumb';
import { scaleLinear } from 'd3-scale';
import { curveNatural, line } from 'd3-shape';
import {
  DetailedHTMLProps,
  HTMLAttributes,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import styled, { useTheme } from 'styled-components';
import useResizeObserver from 'use-resize-observer/polyfilled';
import { ChartRuler } from './ChartRuler';
import { ChartSlider } from './ChartSlider';
import { dropshadowFilter } from './filters';
import { useCoordinateSpace } from './interactions/useCoordinateSpace';
import { Gutter } from './types';

interface Item {
  label: string;
  value: number;
}

export interface APYChartProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  data: Item[];
  gutter?: Gutter;
  margin?: Gutter;
  minY?: number;
  maxY?: number;
}

export function APYChartBase({
  data,
  gutter = { top: 60, bottom: 30, left: 20, right: 20 },
  margin = { top: 20, bottom: 20, left: 20, right: 20 },
  minY: _minY = Math.min(...data.map(({ value }) => value)),
  maxY: _maxY = Math.max(...data.map(({ value }) => value)),
  ...divProps
}: APYChartProps) {
  const { ref, width = 400, height = 200 } = useResizeObserver<HTMLDivElement>(
    {},
  );

  const theme = useTheme();

  const { coordinateSpace, canvasStyle } = useCoordinateSpace({
    width,
    height,
    margin,
    gutter,
  });

  const { minX, minY, maxX, maxY } = useMemo(
    () => ({
      minX: 0,
      maxX: data.length - 1,
      minY: _minY ?? Math.min(...data.map(({ value }) => value)),
      maxY: _maxY ?? Math.max(...data.map(({ value }) => value)),
    }),
    [_maxY, _minY, data],
  );

  const xScale = useMemo(() => {
    return scaleLinear()
      .domain([minX, maxX])
      .range([coordinateSpace.left, coordinateSpace.right])
      .clamp(true);
  }, [coordinateSpace.left, coordinateSpace.right, maxX, minX]);

  const yScale = useMemo(() => {
    return scaleLinear()
      .domain([maxY, minY])
      .range([coordinateSpace.top, coordinateSpace.bottom])
      .clamp(true);
  }, [coordinateSpace.bottom, coordinateSpace.top, maxY, minY]);

  const figureElements = useMemo<ReactNode>(() => {
    const drawPath = line<Item>()
      .curve(curveNatural)
      .x((_, i) => xScale(i))
      .y(({ value }) => yScale(value));

    const d = drawPath(data);

    return (
      d && (
        <path
          d={d}
          stroke="#15cc93"
          strokeWidth={4}
          strokeLinecap="round"
          fill="none"
        />
      )
    );
  }, [data, xScale, yScale]);

  const [sliderPosition, setSliderPosition] = useState<number>(() => maxX);

  const sliderStep = useCallback((nextValue: number) => {
    return Math.round(nextValue);
  }, []);

  const pointingElements = useMemo<ReactNode>(() => {
    const index = Math.max(Math.min(Math.round(sliderPosition), maxX), minX);

    const x = xScale(index);
    const y = yScale(data[index].value);

    return (
      <>
        <line
          x1={x}
          x2={x}
          y1={margin.top}
          y2={coordinateSpace.bottom}
          stroke={theme.dimTextColor}
          strokeWidth={1}
          strokeDasharray="3 3"
        />
        <text
          x={x}
          y={margin.top - 7}
          fontSize={10}
          textAnchor="middle"
          fill={theme.textColor}
          style={{ userSelect: 'none' }}
        >
          JAN 21, 2021
        </text>
        <g transform={`translate(${x} ${y})`} filter="url(#dropshadow)">
          <circle r={6} fill="white" />
          <circle r={2} fill="black" />
        </g>
      </>
    );
  }, [
    coordinateSpace.bottom,
    data,
    margin.top,
    maxX,
    minX,
    sliderPosition,
    theme.dimTextColor,
    theme.textColor,
    xScale,
    yScale,
  ]);

  return (
    <figure ref={ref} {...divProps}>
      <svg style={canvasStyle}>
        <defs>{dropshadowFilter}</defs>
        {figureElements}
        {pointingElements}
        <ChartRuler
          x1={coordinateSpace.left}
          x2={coordinateSpace.right}
          y1={height + margin.top}
          y2={height + margin.top}
        />
        <ChartSlider
          coordinateSpace={{
            x: coordinateSpace.left,
            y: height + margin.top,
            width: coordinateSpace.width,
          }}
          min={minX}
          max={maxX}
          start={minX}
          end={maxX}
          value={sliderPosition}
          stepFunction={sliderStep}
          onChange={setSliderPosition}
        >
          <ChartSliderThumb
            backgroundColor={theme.label.backgroundColor}
            strokeColor={theme.textColor}
            filter="url(#dropshadow)"
          />
        </ChartSlider>
      </svg>
    </figure>
  );
}

export const APYChart = styled(APYChartBase)`
  min-width: 0;
  //background-color: rgba(0, 0, 0, 0.05);

  svg {
    min-width: 0;
    //background-color: rgba(0, 0, 0, 0.02);
  }
`;
