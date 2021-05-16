import {
  rulerLightColor,
  rulerShadowColor,
} from '@terra-dev/styled-neumorphism';
import { Chart } from 'chart.js';
import React, { useEffect, useRef } from 'react';
import styled, { useTheme } from 'styled-components';

export interface ANCPriceChartProps {}

export function ANCPriceChart(_: ANCPriceChartProps) {
  const theme = useTheme();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      //const chart = chartRef.current;
      //chart.data.datasets[0].data = [+totalDeposit, +totalCollaterals];
      //chart.data.datasets[0].backgroundColor = [
      //  totalDepositColor,
      //  totalCollateralsColor,
      //];
      //chart.update();
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

                const span = element.querySelector('span');
                const hr = element.querySelector('hr');

                if (span) {
                  // TODO binding data...
                  span.innerHTML = `5.4 UST <span>Tue, 4 Apr</span>`;
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
            mode: 'nearest',
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
          labels: ['January', 'February', 'March', 'April', 'May', 'June'],
          datasets: [
            {
              data: [0, 10, 5, 2, 20, 30, 45],
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
      <Tooltip ref={tooltipRef}>
        <hr />
        <span />
      </Tooltip>
    </Container>
  );
}

const Tooltip = styled.div`
  position: absolute;
  pointer-events: none;
  opacity: 0;
  left: 0;
  top: 0;

  transition: opacity 0.1s ease-out, transform 0.2s ease-in-out;

  > span {
    display: inline-block;
    min-width: 40px;
    transform: translateX(-50%);
    background-color: ${({ theme }) => theme.textColor};
    color: ${({ theme }) => theme.backgroundColor};
    padding: 5px 10px;
    border-radius: 14px;
    font-size: 11px;

    span {
      color: ${({ theme }) => theme.dimTextColor};
    }
  }

  > hr {
    position: absolute;
    left: 0;
    top: 0;
    border: 0;
    border-left: 1px dashed ${({ theme }) => theme.dimTextColor};
    width: 1px;
  }
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;
