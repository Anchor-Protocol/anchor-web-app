import {
  demicrofy,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { MarketCollateralsHistory } from '@anchor-protocol/webapp-fns';
import big from 'big.js';
import { Chart } from 'chart.js';
import React, { useEffect, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import { ChartTooltip } from './ChartTooltip';
import { mediumDay, xTimestampAixs } from './internal/axisUtils';

export interface CollateralsChartProps {
  data: MarketCollateralsHistory[] | null | undefined;
}

export function CollateralsChart({ data }: CollateralsChartProps) {
  const theme = useTheme();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  const dataRef = useRef(data);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    if (chartRef.current) {
      if (data) {
        const chart = chartRef.current;
        chart.data.labels = xTimestampAixs(
          data.map(({ timestamp }) => timestamp),
        );
        chart.data.datasets[0].data = data.map(({ total_value }) =>
          big(total_value).toNumber(),
        );
        chart.update();
      }
    } else {
      chartRef.current = new Chart(canvasRef.current!, {
        type: 'line',
        options: {
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: false,

              external: ({ chart, tooltip }) => {
                let element = tooltipRef.current!;

                if (tooltip.opacity === 0) {
                  element.style.opacity = '0';
                  return;
                }

                const div1 = element.querySelector('div:nth-child(1)');
                const hr = element.querySelector('hr');

                if (div1) {
                  try {
                    const i = tooltip.dataPoints[0].dataIndex;
                    const isLast = i === dataRef.current!.length - 1;
                    const item = dataRef.current![i];
                    const price = formatUSTWithPostfixUnits(
                      demicrofy(item.total_value),
                    );
                    const date = isLast ? 'Now' : mediumDay(item.timestamp);
                    div1.innerHTML = `${price} UST <span>${date}</span>`;
                  } catch (error) {
                    console.error(error);
                  }
                }

                if (hr) {
                  hr.style.top = chart.scales.y.paddingTop + 'px';
                  hr.style.height = chart.scales.y.height + 'px';
                }

                element.style.opacity = '1';
                element.style.transform = `translateX(${tooltip.caretX}px)`;
              },
            },
          },
          interaction: {
            intersect: false,
            mode: 'index',
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
              ticks: {
                autoSkip: false,
                maxRotation: 0,
                font: {
                  size: 11,
                },
                color: theme.dimTextColor,
              },
            },
            y: {
              grace: '25%',
              display: false,
            },
          },
          elements: {
            point: {
              radius: 0,
            },
          },
        },
        data: {
          labels: data
            ? xTimestampAixs(data.map(({ timestamp }) => timestamp))
            : [],
          datasets: [
            {
              data:
                data?.map(({ total_value }) => big(total_value).toNumber()) ??
                [],
              borderColor: theme.colors.positive,
              borderWidth: 2,
            },
          ],
        },
      });
    }

    if (process.env.NODE_ENV === 'development') {
      return () => {
        chartRef.current?.destroy();
        chartRef.current = null;
      };
    }
  }, [
    data,
    theme.backgroundColor,
    theme.colors.positive,
    theme.dimTextColor,
    theme.intensity,
  ]);

  useEffect(() => {
    return () => {
      chartRef.current?.destroy();
    };
  }, []);

  return (
    <Container>
      <canvas ref={canvasRef} />
      <ChartTooltip ref={tooltipRef}>
        <hr />
        <section>
          <div />
        </section>
      </ChartTooltip>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;
