import { pressed } from '@libs/styled-neumorphism';
import { easeQuadInOut } from 'd3-ease';
import { interpolate } from 'd3-interpolate';
import { select } from 'd3-selection';
import { timer } from 'd3-timer';
import React, {
  DetailedHTMLProps,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  SVGProps,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer/polyfilled';

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const padding: number = 2;
const defaultBarHeight: number = 14;
const defaultBoxRadius: number = 7;

export interface HorizontalGraphBarProps<T>
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>,
    'children'
  > {
  /** Graph minimum value (bar start point) */
  min: number;

  /** Graph maximum value (bar end point) */
  max: number;

  /** Data */
  data: T[];

  /**
   * Render labels (create label react elements) it will call after bar rendering
   *
   * @param value An item of the values
   * @param rect Rectangle of the bar
   */
  labelRenderer?: (value: T, rect: Rect, i: number) => ReactNode | null;

  /** Get the numeric value from the value */
  valueFunction: (value: T) => number;

  /** Get the color code from the value */
  colorFunction: (value: T) => string;

  children?: ReactNode | ((coordinateSpace: Rect) => ReactNode);

  barHeight?: number;
  boxRadius?: number;

  animate?: boolean;
}

const duration = 500;

function HorizontalGraphBarBase<T>({
  className,
  min,
  max,
  children,
  data,
  valueFunction,
  colorFunction,
  labelRenderer,
  barHeight = defaultBarHeight,
  boxRadius = defaultBoxRadius,
  animate = false,
  ...divProps
}: HorizontalGraphBarProps<T>) {
  const { ref, width = 500 } = useResizeObserver<HTMLDivElement>({});

  const total = max - min;

  const coordinateSpace = useMemo<Rect>(() => {
    return {
      x: padding,
      y: padding,
      width: width - padding * 2,
      height: barHeight - padding * 2,
    };
  }, [barHeight, width]);

  const rectsRef = useRef<SVGGElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);

  const [graphRects, setGraphRects] = useState<SVGProps<SVGRectElement>[]>([]);

  const graphRectsRef = useRef(graphRects);

  useEffect(() => {
    graphRectsRef.current = graphRects;
  }, [graphRects]);

  useEffect(() => {
    const nextGraphRects = data.map((item, i) => {
      const r: number = (valueFunction(item) - min) / total;

      return {
        x: padding,
        y: padding,
        width: Math.min(r * (width - padding * 2), width - padding * 2),
        height: barHeight - padding * 2,
        rx: boxRadius - padding,
        ry: boxRadius - padding,
        fill: colorFunction(data[i]),
      };
    });

    setGraphRects(nextGraphRects);

    function draw(drawRects: SVGProps<SVGRectElement>[]) {
      if (!rectsRef.current) return;

      select(rectsRef.current)
        .selectAll('rect')
        .data(drawRects)
        .join(
          (enter) => enter.append('rect'),
          (update) => update,
          (exit) => exit.remove(),
        )
        .attr('fill', ({ fill }) => fill?.toString() ?? null)
        .attr('rx', ({ rx }) => rx?.toString() ?? null)
        .attr('ry', ({ ry }) => ry?.toString() ?? null)
        .attr('x', ({ x }) => x?.toString() ?? null)
        .attr('y', ({ y }) => y?.toString() ?? null)
        .attr('width', ({ width }) => width?.toString() ?? null)
        .attr('height', ({ height }) => height?.toString() ?? null);
    }

    if (animate && rectsRef.current) {
      const ease = easeQuadInOut;

      const interpolateRects = interpolate(
        graphRectsRef.current,
        nextGraphRects,
      );

      const ti = timer((elapsed) => {
        const dv = interpolateRects(ease(Math.min(elapsed / duration, 1)));
        draw(dv);

        if (elapsed > duration) {
          ti.stop();
          draw(nextGraphRects);
        }
      });

      return () => {
        ti.stop();
      };
    } else {
      draw(nextGraphRects);
    }
  }, [
    animate,
    barHeight,
    boxRadius,
    colorFunction,
    data,
    min,
    total,
    valueFunction,
    width,
  ]);

  return (
    <div {...divProps} ref={ref} className={className}>
      <svg width={width} height={barHeight}>
        <g ref={rectsRef} />
      </svg>

      <div ref={labelsRef}>
        {typeof labelRenderer === 'function' &&
          data.length > 0 &&
          graphRects.map((rect, i) => labelRenderer(data[i], rect as Rect, i))}
      </div>

      {typeof children === 'function' ? children(coordinateSpace) : children}
    </div>
  );
}

export const HorizontalGraphBar: <T>(
  props: HorizontalGraphBarProps<T>,
) => ReactElement<HorizontalGraphBarProps<T>> = styled(HorizontalGraphBarBase)`
  width: 100%;
  height: ${({ barHeight = defaultBarHeight }) => barHeight}px;

  padding: 0;
  margin: 0;

  border-radius: ${({ boxRadius = defaultBoxRadius }) => boxRadius}px;

  position: relative;
  font-size: 0;
  color: ${({ theme }) => theme.textColor};

  > span,
  > div > span {
    position: absolute;
    transition: transform ${duration}ms ease-in-out;
  }

  svg {
    rect {
      transition: fill 0.2s ease-in-out;
    }
  }

  ${({ theme }) =>
    pressed({
      color: theme.textInput.backgroundColor,
      backgroundColor: theme.backgroundColor,
      intensity: theme.intensity,
      distance: 1,
    })};
` as any;
