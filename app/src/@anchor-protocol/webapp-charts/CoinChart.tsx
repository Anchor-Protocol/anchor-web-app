import { scaleLinear } from 'd3-scale';
import { curveNatural, curveStep, line } from 'd3-shape';
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
import { Gutter, Rect } from './types';

interface Item {
  label: string;
  apy: number;
  total: number;
}

export interface CoinChartProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  className?: string;
  data: Item[];
  gutter?: Gutter;
  margin?: Gutter;
}

const yLayout = {
  apy: {
    top: 0.1,
    bottom: 0.35,
  },
  total: {
    top: 0.5,
    bottom: 0.97,
  },
} as const;

type ColorPalette = {
  apy: {
    line: SVGProps<SVGPathElement>;
  };

  total: {
    stepLine: SVGProps<SVGPathElement>;
    tickLine: SVGProps<SVGLineElement>;
  };

  pointing: {
    backgroundFill: SVGProps<SVGRectElement>;
  };
};

const palette: ColorPalette = {
  apy: {
    line: {
      stroke: '#2c2c2c',
      strokeWidth: 4,
    },
  },

  total: {
    stepLine: {
      stroke: '#d3d3d5',
      strokeWidth: 5,
    },

    tickLine: {
      stroke: '#d3d3d5',
      strokeDasharray: '3 3',
    },
  },

  pointing: {
    backgroundFill: {
      fill: '#ffffff',
    },
  },
};

function CoinChartBase({
  data,
  gutter = { top: 20, bottom: 20, left: 20, right: 20 },
  margin = { top: 20, bottom: 20, left: 20, right: 20 },
  ...divProps
}: CoinChartProps) {
  const {
    ref,
    width = 400,
    height = 200,
  } = useResizeObserver<HTMLDivElement>({});

  const theme = useTheme();

  const { coordinateSpace, canvasStyle } = useCoordinateSpace({
    width,
    height,
    margin,
    gutter,
  });

  const { minX, maxX, minAPY, maxAPY, minTotal, maxTotal } = useMemo(
    () => ({
      minX: 0,
      maxX: data.length - 1,
      minAPY: Math.min(...data.map(({ apy }) => apy)),
      maxAPY: Math.max(...data.map(({ apy }) => apy)),
      minTotal: Math.min(...data.map(({ total }) => total)),
      maxTotal: Math.max(...data.map(({ total }) => total)),
    }),
    [data],
  );

  const xScale = useMemo(() => {
    return scaleLinear()
      .domain([minX, maxX])
      .range([coordinateSpace.left, coordinateSpace.right])
      .clamp(true);
  }, [coordinateSpace.left, coordinateSpace.right, maxX, minX]);

  const apyScale = useMemo(() => {
    return scaleLinear()
      .domain([maxAPY, minAPY])
      .range([
        coordinateSpace.top + coordinateSpace.height * yLayout.apy.top,
        coordinateSpace.top + coordinateSpace.height * yLayout.apy.bottom,
      ])
      .clamp(true);
  }, [coordinateSpace.height, coordinateSpace.top, maxAPY, minAPY]);

  const totalScale = useMemo(() => {
    return scaleLinear()
      .domain([maxTotal, minTotal])
      .range([
        coordinateSpace.top + coordinateSpace.height * yLayout.total.top,
        coordinateSpace.top + coordinateSpace.height * yLayout.total.bottom,
      ])
      .clamp(true);
  }, [coordinateSpace.height, coordinateSpace.top, maxTotal, minTotal]);

  const totalStepRects = useMemo<Rect[]>(() => {
    const xTickWidth = xScale(1) - xScale(0);

    return data.map<Rect>(({ total }, i) => {
      const y = totalScale(total);
      return {
        x: xScale(i) - xTickWidth / 2,
        y,
        width: xTickWidth,
        height: coordinateSpace.bottom - y,
      };
    });
  }, [coordinateSpace.bottom, data, totalScale, xScale]);

  const figureElements = useMemo<ReactNode>(() => {
    const apyDrawPath = line<Item>()
      .curve(curveNatural)
      .x((_, i) => xScale(i))
      .y(({ apy }) => apyScale(apy));

    const totalDrawPath = line<Item>()
      .curve(curveStep)
      .x((_, i) => xScale(i))
      .y(({ total }) => totalScale(total));

    const apy = apyDrawPath(data);
    const total = totalDrawPath(data);

    return (
      <>
        {apy && (
          <path
            d={apy}
            {...palette.apy.line}
            strokeLinecap="round"
            fill="none"
          />
        )}
        {totalStepRects
          .slice(0, totalStepRects.length - 1)
          .map(({ x, y, width, height }, i) => (
            <line
              key={'totalTick' + i}
              x1={x + width}
              x2={x + width}
              y1={y}
              y2={y + height}
              {...palette.total.tickLine}
            />
          ))}
        {total && (
          <path
            d={total}
            {...palette.total.stepLine}
            strokeLinecap="round"
            fill="none"
          />
        )}
      </>
    );
  }, [apyScale, data, totalScale, totalStepRects, xScale]);

  const [sliderPosition, setSliderPosition] = useState<number>(() => maxX);

  const sliderStep = useCallback((nextValue: number) => {
    return Math.round(nextValue);
  }, []);

  const [backPointingElements, frontPointingElements] = useMemo<
    [ReactNode, ReactNode]
  >(() => {
    const index = Math.max(Math.min(Math.round(sliderPosition), maxX), minX);

    const stepRect = totalStepRects[index];

    const x = xScale(index);
    const apy = apyScale(data[index].apy);
    const total = totalScale(data[index].total);

    return [
      <rect
        x={Math.max(stepRect.x, coordinateSpace.left)}
        y={coordinateSpace.top}
        width={
          index === 0 || index === data.length - 1
            ? stepRect.width / 2
            : stepRect.width
        }
        height={coordinateSpace.height}
        {...palette.pointing.backgroundFill}
      />,
      <>
        <g transform={`translate(${x} ${apy})`} filter="url(#dropshadow)">
          <circle r={6} fill="white" />
          <circle r={2} fill={palette.apy.line.stroke} />
        </g>
        <g transform={`translate(${x} ${total})`} filter="url(#dropshadow)">
          <circle r={6} fill="white" />
          <circle r={2} fill={palette.total.stepLine.stroke} />
        </g>
      </>,
    ];
  }, [
    apyScale,
    coordinateSpace.height,
    coordinateSpace.left,
    coordinateSpace.top,
    data,
    maxX,
    minX,
    sliderPosition,
    totalScale,
    totalStepRects,
    xScale,
  ]);

  return (
    <figure ref={ref} {...divProps}>
      <svg style={canvasStyle}>
        <defs>{dropshadowFilter}</defs>
        {backPointingElements}
        {figureElements}
        {frontPointingElements}
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

export const CoinChart = styled(CoinChartBase)`
  min-width: 0;
  //background-color: rgba(0, 0, 0, 0.05);

  svg {
    min-width: 0;
    //background-color: rgba(0, 0, 0, 0.02);
  }
`;
