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
  isDevelopment?: boolean;
  minY?: number;
  maxY?: number;
}

export function APYChartBase({
  data,
  gutter = { top: 60, bottom: 30, left: 20, right: 20 },
  margin = { top: 20, bottom: 20, left: 20, right: 20 },
  minY = Math.min(...data.map(({ value }) => value)),
  maxY = Math.max(...data.map(({ value }) => value)),
  isDevelopment,
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

  const xScale = useMemo(() => {
    return scaleLinear()
      .domain([0, data.length - 1])
      .range([coordinateSpace.left, coordinateSpace.right])
      .clamp(true);
  }, [coordinateSpace.left, coordinateSpace.right, data.length]);

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

  const [sliderPosition, setSliderPosition] = useState<number>(
    () => data.length - 1,
  );

  const sliderStep = useCallback((nextValue: number) => {
    return Math.round(nextValue);
  }, []);

  const pointingElements = useMemo<ReactNode>(() => {
    const index = Math.max(
      Math.min(Math.round(sliderPosition), data.length - 1),
      0,
    );

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
          min={0}
          max={data.length - 1}
          start={0}
          end={data.length - 1}
          value={sliderPosition}
          stepFunction={sliderStep}
          onChange={setSliderPosition}
        >
          <circle
            r={10}
            fill={theme.label.backgroundColor}
            stroke={theme.textColor}
            filter="url(#dropshadow)"
          />
          <path
            d="M6.32825,5.35325 L8.57825,3.10325 C8.77325,2.90825 8.77325,2.59125 8.57825,2.39625 L6.32825,0.14625 C6.13325,-0.04875 5.81625,-0.04875 5.62125,0.14625 C5.42625,0.34125 5.42625,0.65825 5.62125,0.85325 L7.51725,2.74925 L5.62125,4.64625 C5.42625,4.84125 5.42625,5.15825 5.62125,5.35325 C5.71925,5.45125 5.84725,5.49925 5.97425,5.49925 C6.10225,5.49925 6.23025,5.45125 6.32825,5.35325 M2.75025,5.49925 C2.62225,5.49925 2.49425,5.45125 2.39625,5.35325 L0.14625,3.10325 C-0.04875,2.90825 -0.04875,2.59125 0.14625,2.39625 L2.39625,0.14625 C2.59225,-0.04875 2.90825,-0.04875 3.10325,0.14625 C3.29925,0.34125 3.29925,0.65825 3.10325,0.85325 L1.20725,2.74925 L3.10325,4.64625 C3.29925,4.84125 3.29925,5.15825 3.10325,5.35325 C3.00625,5.45125 2.87825,5.49925 2.75025,5.49925"
            transform="translate(-4 -3)"
            fill={theme.textColor}
          />
        </ChartSlider>
      </svg>
    </figure>
  );
}

export const APYChart = styled(APYChartBase)`
  min-width: 0;

  ${({ isDevelopment }) =>
    isDevelopment && `background-color: rgba(0, 0, 0, 0.05)`};

  svg {
    min-width: 0;

    ${({ isDevelopment }) =>
      isDevelopment && `background-color: rgba(0, 0, 0, 0.02)`};
  }
`;
