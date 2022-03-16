import { formatUSTWithPostfixUnits } from '@anchor-protocol/notation';
import { MarketDepositAndBorrow } from '@anchor-protocol/app-fns';
import { demicrofy } from '@libs/formatter';
import big from 'big.js';
import { Chart } from 'chart.js';
import React, { Component, createRef } from 'react';
import styled, { DefaultTheme } from 'styled-components';
import { ChartTooltip } from './ChartTooltip';
import { mediumDay, xTimestampAxis } from './internal/axisUtils';

export interface StablecoinChartProps {
  data: MarketDepositAndBorrow[];
  theme: DefaultTheme;
  isMobile: boolean;
}

export class StablecoinChart extends Component<StablecoinChartProps> {
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
            <div
              style={{ backgroundColor: this.props.theme.colors.secondary }}
            />
            <div />
          </section>
        </ChartTooltip>
      </Container>
    );
  }

  componentWillUnmount() {
    this.chart?.destroy();
  }

  shouldComponentUpdate(nextProps: Readonly<StablecoinChartProps>): boolean {
    return (
      this.props.data !== nextProps.data ||
      this.props.theme !== nextProps.theme ||
      this.props.isMobile !== nextProps.isMobile
    );
  }

  componentDidMount() {
    this.createChart();
  }

  componentDidUpdate(prevProps: Readonly<StablecoinChartProps>) {
    if (prevProps.data !== this.props.data) {
      this.chart.data.labels = xTimestampAxis(
        this.props.data.map(({ timestamp }) => timestamp),
      );
      this.chart.data.datasets[0].data = this.props.data.map(
        ({ total_ust_deposits }) => big(total_ust_deposits).toNumber(),
      );
      this.chart.data.datasets[1].data = this.props.data.map(
        ({ total_borrowed }) => big(total_borrowed).toNumber(),
      );
    }

    if (prevProps.theme !== this.props.theme) {
      if (this.chart.options.scales?.x?.ticks) {
        this.chart.options.scales.x.ticks.color = this.props.theme.dimTextColor;
      }
      this.chart.data.datasets[0].borderColor =
        this.props.theme.colors.secondary;
      this.chart.data.datasets[1].borderColor = this.props.theme.textColor;
    }

    if (prevProps.isMobile !== this.props.isMobile) {
      if (
        this.chart.options.scales?.x?.ticks &&
        'maxRotation' in this.chart.options.scales.x.ticks
      ) {
        this.chart.options.scales.x.ticks.maxRotation = this.props.isMobile
          ? undefined
          : 0;
      }
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
              const div2 = element.querySelector('div:nth-child(2)');
              const hr = element.querySelector('hr');

              if (div1 && div2) {
                try {
                  const i = tooltip.dataPoints[0].dataIndex;
                  const isLast = i === this.props.data.length - 1;
                  const item = this.props.data[i];
                  const deposits = formatUSTWithPostfixUnits(
                    demicrofy(item.total_ust_deposits),
                  );
                  const borrows = formatUSTWithPostfixUnits(
                    demicrofy(item.total_borrowed),
                  );
                  const date = isLast ? 'Now' : mediumDay(item.timestamp);

                  div1.innerHTML = `${deposits} UST <span>${date}</span>`;
                  div2.innerHTML = `${borrows} UST <span>${date}</span>`;
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
              autoSkip: false,
              maxRotation: this.props.isMobile ? undefined : 0,
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
        labels: xTimestampAxis(
          this.props.data.map(({ timestamp }) => timestamp),
        ),
        datasets: [
          {
            data: this.props.data.map(({ total_ust_deposits }) =>
              big(total_ust_deposits).toNumber(),
            ),
            borderColor: this.props.theme.colors.secondary,
            borderWidth: 2,
          },
          {
            data: this.props.data.map(({ total_borrowed }) =>
              big(total_borrowed).toNumber(),
            ),
            borderColor: this.props.theme.textColor,
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
