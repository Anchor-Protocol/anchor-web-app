import { Rate } from '@anchor-protocol/types';
import { formatRate } from '@libs/formatter';
import { scaleLinear } from 'd3-scale';
import { curveNatural, line } from 'd3-shape';
import { format } from 'date-fns';
import React, {
  DetailedHTMLProps,
  HTMLAttributes,
  ReactNode,
  SVGProps,
  useCallback,
  useMemo,
  useState,
} from 'react';
import styled, { useTheme } from 'styled-components';
import useResizeObserver from 'use-resize-observer/polyfilled';
import { ChartRuler } from './ChartRuler';
import { ChartSlider } from './ChartSlider';
import { ChartSliderThumb } from './ChartSliderThumb';
import { dropshadowFilter } from './filters';
import { useCoordinateSpace } from './interactions/useCoordinateSpace';
import { Gutter } from './types';

export interface APYChartItem {
  date: Date;
  value: Rate<number>;
}

export interface APYChartProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  data: APYChartItem[];
  gutter?: Gutter;
  margin?: Gutter;
  minY?: (...values: number[]) => number;
  maxY?: (...values: number[]) => number;
}

type ColorPalette = {
  line: SVGProps<SVGPathElement>;

  pointing: {
    line: SVGProps<SVGLineElement>;
    date: SVGProps<SVGTextElement>;
  };
  slider: {
    backgroundColor: string;
    strokeColor: string;
  };
};

function useColorPalette(): ColorPalette {
  const theme = useTheme();
  return useMemo<ColorPalette>(() => {
    return {
      line: {
        stroke: theme.colors.primary,
        strokeWidth: 4,
      },
      pointing: {
        line: {
          stroke: '#9E9FB3',
          strokeWidth: 1,
          strokeDasharray: '3 3',
        },
        date: {
          fill: theme.textColor,
        },
      },
      slider: {
        backgroundColor: theme.label.backgroundColor,
        strokeColor: theme.textColor,
      },
    };
  }, [theme.colors.primary, theme.label.backgroundColor, theme.textColor]);
}

export function APYChartBase({
  data,
  gutter = { top: 60, bottom: 30, left: 20, right: 20 },
  margin = { top: 20, bottom: 20, left: 20, right: 20 },
  minY: _minY = Math.min,
  maxY: _maxY = Math.max,
  ...divProps
}: APYChartProps) {
  const {
    ref,
    width = 400,
    height = 200,
  } = useResizeObserver<HTMLDivElement>({});

  const palette = useColorPalette();

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
      minY: _minY(...data.map(({ value }) => value)),
      maxY: _maxY(...data.map(({ value }) => value)),
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
      .range([coordinateSpace.top, coordinateSpace.bottom]);
  }, [coordinateSpace.bottom, coordinateSpace.top, maxY, minY]);

  const figureElements = useMemo<ReactNode>(() => {
    const drawPath = line<APYChartItem>()
      .curve(curveNatural)
      .x((_, i) => xScale(i))
      .y(({ value }) => yScale(value));

    const d = drawPath(data);

    return (
      d && <path d={d} {...palette.line} strokeLinecap="round" fill="none" />
    );
  }, [data, palette.line, xScale, yScale]);

  const [sliderPosition, setSliderPosition] = useState<number>(() => maxX);

  const sliderStep = useCallback((nextValue: number) => {
    return Math.round(nextValue);
  }, []);

  const pointingElements = useMemo<ReactNode>(() => {
    const index = Math.max(Math.min(Math.round(sliderPosition), maxX), minX);

    const x = xScale(index);
    const y = yScale(data[index].value);

    const percentage = formatRate(data[index].value);

    const fontSize = 12;
    const rectRadius = 13;
    const rectHeight = 26;
    const rectWidth = rectRadius + (percentage.length + 4) * (fontSize * 0.85);

    const textAnchor =
      window.innerWidth < 600
        ? index < 1
          ? 'start'
          : index > maxX - 1
          ? 'end'
          : 'middle'
        : 'middle';

    const shiftX =
      textAnchor === 'start'
        ? rectWidth / 2
        : textAnchor === 'end'
        ? rectWidth / -2
        : 0;

    return (
      <>
        <line
          x1={x}
          x2={x}
          y1={margin.top}
          y2={coordinateSpace.bottom}
          {...palette.pointing.line}
        />
        <text
          x={x}
          y={margin.top - 7}
          fontSize={14}
          fontWeight={500}
          textAnchor={textAnchor}
          {...palette.pointing.date}
        >
          {format(data[index].date, 'MMM dd, yyyy')}
        </text>
        <g transform={`translate(${x} ${y})`} filter="url(#dropshadow)">
          <circle r={7} fill={palette.line.stroke} />
          <rect
            x={rectWidth / -2 + shiftX}
            y={rectHeight / -2 - 30}
            width={rectWidth}
            height={rectHeight}
            rx={rectRadius}
            ry={rectRadius}
            fill="rgba(255, 255, 255, 0.9)"
          />
          <text
            x={shiftX}
            y={4 - 30}
            width={rectWidth}
            fontSize={fontSize}
            textAnchor="middle"
          >
            APY <tspan fontWeight="700">{percentage}%</tspan>
          </text>
        </g>
      </>
    );
  }, [
    coordinateSpace.bottom,
    data,
    margin.top,
    maxX,
    minX,
    palette.line.stroke,
    palette.pointing.date,
    palette.pointing.line,
    sliderPosition,
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
          <ChartSliderThumb {...palette.slider} filter="url(#dropshadow)" />
        </ChartSlider>
      </svg>
    </figure>
  );
}

export const APYChart = styled(APYChartBase)`
  min-width: 0;
  svg {
    min-width: 0;
    user-select: none;
  }
`;
