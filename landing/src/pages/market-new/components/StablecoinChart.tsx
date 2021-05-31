import {
  demicrofy,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import big from 'big.js';
import { Chart } from 'chart.js';
import React, { useEffect, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import { MarketDepositAndBorrow } from '../queries/marketDepositAndBorrow';
import { ChartTooltip } from './ChartTooltip';
import { mediumDay, shortDay } from './internal/dateFormatters';

export interface StablecoinChartProps {
  data: MarketDepositAndBorrow[] | null | undefined;
}

export function StablecoinChart({ data }: StablecoinChartProps) {
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
        chart.data.labels = data.map(({ timestamp }) => shortDay(timestamp));
        chart.data.datasets[0].data = data.map(({ total_ust_deposits }) =>
          big(total_ust_deposits).toNumber(),
        );
        chart.data.datasets[1].data = data.map(({ total_borrowed }) =>
          big(total_borrowed).toNumber(),
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

              external({ chart, tooltip }) {
                let element = tooltipRef.current!;

                if (tooltip.opacity === 0) {
                  element.style.opacity = '0';
                  return;
                }

                const div1 = element.querySelector('div:nth-child(1)');
                const div2 = element.querySelector('div:nth-child(2)');
                const hr = element.querySelector('hr');

                if (div1 && div2) {
                  try {
                    const item = dataRef.current![
                      tooltip.dataPoints[0].dataIndex
                    ];

                    div1.innerHTML = `${formatUSTWithPostfixUnits(
                      demicrofy(item.total_ust_deposits),
                    )} UST <span>${mediumDay(item.timestamp)}</span>`;

                    div2.innerHTML = `${formatUSTWithPostfixUnits(
                      demicrofy(item.total_borrowed),
                    )} UST <span>${mediumDay(item.timestamp)}</span>`;
                  } catch {}
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
          labels: data?.map(({ timestamp }) => shortDay(timestamp)) ?? [],
          datasets: [
            {
              data:
                data?.map(({ total_ust_deposits }) =>
                  big(total_ust_deposits).toNumber(),
                ) ?? [],
              borderColor: theme.colors.positive,
              borderWidth: 2,
            },
            {
              data:
                data?.map(({ total_borrowed }) =>
                  big(total_borrowed).toNumber(),
                ) ?? [],
              borderColor: theme.textColor,
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
    theme.backgroundColor,
    theme.colors.positive,
    theme.dimTextColor,
    theme.textColor,
    theme.intensity,
    data,
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
          <div style={{ backgroundColor: theme.colors.positive }} />
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
