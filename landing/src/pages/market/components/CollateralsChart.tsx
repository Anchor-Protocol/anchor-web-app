import {
  demicrofy,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { MarketCollateralsHistory } from '@anchor-protocol/webapp-fns';
import big from 'big.js';
import { Chart } from 'chart.js';
import React, { Component, createRef } from 'react';
import styled, { DefaultTheme } from 'styled-components';
import { ChartTooltip } from './ChartTooltip';
import { mediumDay, xTimestampAixs } from './internal/axisUtils';

export interface CollateralsChartProps {
  data: MarketCollateralsHistory[];
  theme: DefaultTheme;
}

export class CollateralsChart extends Component<CollateralsChartProps> {
  private canvasRef = createRef<HTMLCanvasElement>();
  private tooltipRef = createRef<HTMLDivElement>();
  private chart!: Chart;

  render() {
    return (
      <Container>
        <canvas ref={this.canvasRef} />
        <ChartTooltip ref={this.tooltipRef}>
          <hr />
          <section>
            <div />
          </section>
        </ChartTooltip>
      </Container>
    );
  }

  componentWillUnmount() {
    this.chart.destroy();
  }

  shouldComponentUpdate(nextProps: Readonly<CollateralsChartProps>): boolean {
    return (
      this.props.data !== nextProps.data || this.props.theme !== nextProps.theme
    );
  }

  componentDidMount() {
    this.createChart();
  }

  componentDidUpdate(prevProps: Readonly<CollateralsChartProps>) {
    if (prevProps.data !== this.props.data) {
      this.chart.data.labels = xTimestampAixs(
        this.props.data.map(({ timestamp }) => timestamp),
      );
      this.chart.data.datasets[0].data = this.props.data.map(
        ({ total_value }) => big(total_value).toNumber(),
      );
    }

    if (prevProps.theme !== this.props.theme) {
      if (this.chart.options.scales?.x?.ticks) {
        this.chart.options.scales.x.ticks.color = this.props.theme.dimTextColor;
      }
      this.chart.data.datasets[0].borderColor =
        this.props.theme.colors.positive;
    }

    this.chart.update();
  }

  private createChart = () => {
    this.chart = new Chart(this.canvasRef.current!, {
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
              let element = this.tooltipRef.current!;

              if (tooltip.opacity === 0) {
                element.style.opacity = '0';
                return;
              }

              const div1 = element.querySelector('div:nth-child(1)');
              const hr = element.querySelector('hr');

              if (div1) {
                try {
                  const i = tooltip.dataPoints[0].dataIndex;
                  const isLast = i === this.props.data.length - 1;
                  const item = this.props.data[i];
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
              color: this.props.theme.dimTextColor,
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
        labels: xTimestampAixs(
          this.props.data.map(({ timestamp }) => timestamp),
        ),
        datasets: [
          {
            data: this.props.data?.map(({ total_value }) =>
              big(total_value).toNumber(),
            ),
            borderColor: this.props.theme.colors.positive,
            borderWidth: 2,
          },
        ],
      },
    });
  };
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;
