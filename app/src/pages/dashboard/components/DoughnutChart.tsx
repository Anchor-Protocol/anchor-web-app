import { Chart } from 'chart.js';
import React, { Component, createRef } from 'react';

export type DoughnutChartDescriptor = {
  label: string;
  color: string;
  value: number;
};

export interface DoughnutChartProps {
  descriptors: DoughnutChartDescriptor[];
}

export class DoughnutChart extends Component<DoughnutChartProps> {
  private canvasRef = createRef<HTMLCanvasElement>();
  private chart!: Chart;

  render() {
    return <canvas ref={this.canvasRef} />;
  }

  componentWillUnmount() {
    this.chart?.destroy();
  }

  shouldComponentUpdate(nextProps: Readonly<DoughnutChartProps>): boolean {
    return this.props.descriptors !== nextProps.descriptors;
  }

  componentDidMount() {
    this.createChart();
  }

  componentDidUpdate(prevProps: Readonly<DoughnutChartProps>) {
    if (this.props.descriptors !== prevProps.descriptors) {
      const noValuePresent =
        this.props.descriptors.filter((d) => d.value !== 0).length === 0;

      if (noValuePresent) {
        this.chart.data.labels = ['blank'];
        this.chart.data.datasets[0].data = [1];
        this.chart.data.datasets[0].backgroundColor = ['#c2c2c2'];
      } else {
        this.chart.data.datasets[0].data = this.props.descriptors.map(
          (d) => d.value,
        );
        this.chart.data.datasets[0].backgroundColor =
          this.props.descriptors.map((d) => d.color);
      }
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
        labels: this.props.descriptors.map((d) => d.label),
        datasets: [
          {
            data: this.props.descriptors.map((d) => d.value),
            backgroundColor: this.props.descriptors.map((d) => d.color),
            borderWidth: 0,
            hoverOffset: 0,
          },
        ],
      },
    });
  };
}
