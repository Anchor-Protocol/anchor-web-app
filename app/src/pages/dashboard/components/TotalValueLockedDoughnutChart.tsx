import { u, UST } from '@anchor-protocol/types';
import { Chart } from 'chart.js';
import React, { Component, createRef } from 'react';

export interface TotalValueLockedDoughnutChartProps {
  totalDeposit: u<UST>;
  totalCollaterals: u<UST>;
  totalDepositColor: string;
  totalCollateralsColor: string;
}

export class TotalValueLockedDoughnutChart extends Component<TotalValueLockedDoughnutChartProps> {
  private canvasRef = createRef<HTMLCanvasElement>();
  private chart!: Chart;

  render() {
    return <canvas ref={this.canvasRef} />;
  }

  componentWillUnmount() {
    this.chart?.destroy();
  }

  shouldComponentUpdate(
    nextProps: Readonly<TotalValueLockedDoughnutChartProps>,
  ): boolean {
    return (
      this.props.totalDeposit !== nextProps.totalDeposit ||
      this.props.totalCollaterals !== nextProps.totalCollaterals ||
      this.props.totalDepositColor !== nextProps.totalDepositColor ||
      this.props.totalCollateralsColor !== nextProps.totalCollateralsColor
    );
  }

  componentDidMount() {
    this.createChart();
  }

  componentDidUpdate(prevProps: Readonly<TotalValueLockedDoughnutChartProps>) {
    if (
      this.props.totalDeposit !== prevProps.totalDeposit ||
      this.props.totalCollaterals !== prevProps.totalCollaterals
    ) {
      this.chart.data.datasets[0].data = [
        +this.props.totalDeposit,
        +this.props.totalCollaterals,
      ];
    }

    if (
      this.props.totalDepositColor !== prevProps.totalDepositColor ||
      this.props.totalCollateralsColor !== prevProps.totalCollateralsColor
    ) {
      this.chart.data.datasets[0].backgroundColor = [
        this.props.totalDepositColor,
        this.props.totalCollateralsColor,
      ];
    }

    this.chart.update();
  }

  private createChart = () => {
    this.chart = new Chart(this.canvasRef.current!, {
      type: 'doughnut',
      options: {
        cutout: '80%',
        radius: '90%',
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
      },
      data: {
        labels: ['Total Deposit', 'Total Collateral'],
        datasets: [
          {
            data: [+this.props.totalDeposit, +this.props.totalCollaterals],
            backgroundColor: [
              this.props.totalDepositColor,
              this.props.totalCollateralsColor,
            ],
            borderWidth: 0,
            hoverOffset: 0,
          },
        ],
      },
    });
  };
}
