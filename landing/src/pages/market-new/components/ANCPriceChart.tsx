import {
  rulerLightColor,
  rulerShadowColor,
} from '@terra-dev/styled-neumorphism';
import { Chart } from 'chart.js';
import { ChartTooltip } from 'pages/market-new/components/ChartTooltip';
import React, { useEffect, useRef } from 'react';
import styled, { useTheme } from 'styled-components';

export interface ANCPriceChartItem {
  value: number;
  label: string;
}

export interface ANCPriceChartProps {
  data: ANCPriceChartItem[] | null;
}

export function ANCPriceChart({ data }: ANCPriceChartProps) {
  const theme = useTheme();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      if (data) {
        const chart = chartRef.current;
        chart.data.labels = data.map(({ label }) => label);
        chart.data.datasets[0].data = data.map(({ value }) => value);
        //chart.data.datasets[0].backgroundColor = [
        //  totalDepositColor,
        //  totalCollateralsColor,
        //];
        chart.update();
      }
    } else {
      chartRef.current = new Chart(canvasRef.current!, {
        type: 'line',
        plugins: [
          {
            id: 'custom-y-axis-draw',
            afterDraw(chart) {
              const ctx = chart.ctx;
              ctx.save();
              ctx.globalCompositeOperation = 'destination-over';

              const xScale = chart.scales.x;
              const yScale = chart.scales.y;

              let i: number = yScale.ticks.length;

              while (--i >= 0) {
                const y = yScale.getPixelForTick(i);
                ctx.strokeStyle = rulerShadowColor({
                  intensity: theme.intensity,
                  color: theme.backgroundColor,
                });
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(xScale.left, y);
                ctx.lineTo(xScale.right, y);
                ctx.stroke();
                ctx.strokeStyle = rulerLightColor({
                  intensity: theme.intensity,
                  color: theme.backgroundColor,
                });
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(xScale.left, y + 1);
                ctx.lineTo(xScale.right, y + 1);
                ctx.stroke();
              }
              ctx.restore();
            },
          },
        ],
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
                const hr = element.querySelector('hr');

                if (div1) {
                  try {
                    const item = data![tooltip.dataPoints[0].dataIndex];
                    // TODO binding data...
                    div1.innerHTML = `${item.value} UST <span>${item.label}</span>`;
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
              grid: {
                display: false,
                drawBorder: false,
              },
              ticks: {
                font: {
                  size: 11,
                },
                color: theme.dimTextColor,
              },
            },
          },
          elements: {
            point: {
              radius: 0,
            },
          },
        },
        data: {
          labels: data?.map(({ label }) => label) ?? [],
          datasets: [
            {
              data: data?.map(({ value }) => value) ?? [],
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
