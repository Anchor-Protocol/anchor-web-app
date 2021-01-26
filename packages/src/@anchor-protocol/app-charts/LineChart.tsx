import { scaleLinear } from 'd3-scale';
import { curveNatural, line } from 'd3-shape';
import { DetailedHTMLProps, HTMLAttributes, useMemo } from 'react';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer/polyfilled';

interface Item {
  label: string;
  date: number;
  value: number;
}

export interface APYChartProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  data: Item[];
}

export function APYChartBase({ data, ...divProps }: APYChartProps) {
  const { ref, width = 400, height = 200 } = useResizeObserver<HTMLDivElement>(
    {},
  );

  const elements = useMemo(() => {
    const x = scaleLinear()
      .domain([0, Math.max(...data.map(({ date }) => date))])
      .range([0, width]);

    const y = scaleLinear()
      .domain([0, Math.max(...data.map(({ value }) => value))])
      .range([0, height]);

    const drawPath = line<Item>()
      .curve(curveNatural)
      .x(({ date }) => x(date))
      .y(({ value }) => y(value));

    return (
      <>
        <path d={drawPath(data)!} stroke="white" strokeWidth={4} fill="none" />
      </>
    );
  }, [data, height, width]);

  return (
    <figure ref={ref} {...divProps}>
      <svg style={{width, height}}>
        {elements}
      </svg>
    </figure>
  );
}

export const LineChart = styled(APYChartBase)`
  min-width: 0;

  svg {
    min-width: 0;
  }
`;
