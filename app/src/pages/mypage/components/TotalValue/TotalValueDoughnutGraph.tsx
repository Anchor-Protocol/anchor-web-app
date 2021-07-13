import { Chart } from 'chart.js';
import React, { Component, createRef } from 'react';
import { Item } from './types';

export interface TotalValueDoughnutChartProps {
  data: Item[];
  colors: string[];
}

export class TotalValueDoughnutChart extends Component<TotalValueDoughnutChartProps> {
  private canvasRef = createRef<HTMLCanvasElement>();
  private chart!: Chart;

  render() {
    return <canvas ref={this.canvasRef} />;
  }

  componentWillUnmount() {
    this.chart.destroy();
  }

  shouldComponentUpdate(
    nextProps: Readonly<TotalValueDoughnutChartProps>,
  ): boolean {
    return (
      this.props.data !== nextProps.data ||
      this.props.colors !== nextProps.colors
    );
  }

  componentDidMount() {
    this.createChart();
  }

  componentDidUpdate(prevProps: Readonly<TotalValueDoughnutChartProps>) {
    if (this.props.data !== prevProps.data) {
      //this.chart.data.datasets[0].data = [
      //  +this.props.totalDeposit,
      //  +this.props.totalCollaterals,
      //];
    }

    if (this.props.colors !== prevProps.colors) {
      //this.chart.data.datasets[0].backgroundColor = [
      //  this.props.totalDepositColor,
      //  this.props.totalCollateralsColor,
      //];
    }

    this.chart.update();
  }

  private createChart = () => {
    this.chart = new Chart(this.canvasRef.current!, {
      type: 'doughnut',
      options: {
        cutout: '65%',
        radius: '100%',
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
        labels: this.props.data.map(({ label }) => label),
        datasets: [
          {
            data: this.props.data.map(({ amount }) => +amount),
            backgroundColor: this.props.data.map(
              (_, i) => this.props.colors[i],
            ),
            borderWidth: 0,
            hoverOffset: 0,
          },
        ],
      },
    });
  };
}
