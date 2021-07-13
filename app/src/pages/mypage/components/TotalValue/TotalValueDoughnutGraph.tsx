import { Chart } from 'chart.js';
import React, { Component, createRef } from 'react';
import { Item } from './types';

export interface TotalValueDoughnutChartProps {
  data: Item[];
  colors: string[];
  onFocus: (dataIndex: number) => void;
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
    if (
      this.props.data !== prevProps.data ||
      this.props.colors !== prevProps.colors
    ) {
      this.chart.data.labels = this.props.data.map(({ label }) => label);
      this.chart.data.datasets[0].data = this.props.data.map(
        ({ amount }) => +amount,
      );
      this.chart.data.datasets[0].backgroundColor = this.props.data.map(
        (_, i) => this.props.colors[i],
      );
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
        onHover: (event, elements) => {
          this.props.onFocus(elements[0]?.index ?? -1);
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
