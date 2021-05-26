import { uUST } from '@anchor-protocol/types';
import { Chart } from 'chart.js';
import React, { useEffect, useRef } from 'react';

export interface TotalValueLockedDoughnutChartProps {
  totalDeposit: uUST;
  totalCollaterals: uUST;
  totalDepositColor: string;
  totalCollateralsColor: string;
}

export function TotalValueLockedDoughnutChart({
  totalDeposit,
  totalCollaterals,
  totalDepositColor,
  totalCollateralsColor,
}: TotalValueLockedDoughnutChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current;
      chart.data.datasets[0].data = [+totalDeposit, +totalCollaterals];
      chart.data.datasets[0].backgroundColor = [
        totalDepositColor,
        totalCollateralsColor,
      ];
      chart.update();
    } else {
      chartRef.current = new Chart(canvasRef.current!, {
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
              data: [+totalDeposit, +totalCollaterals],
              backgroundColor: [totalDepositColor, totalCollateralsColor],
              borderWidth: 0,
              hoverOffset: 0,
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
    totalCollaterals,
    totalCollateralsColor,
    totalDeposit,
    totalDepositColor,
  ]);

  useEffect(() => {
    return () => {
      chartRef.current?.destroy();
    };
  }, []);

  return <canvas ref={canvasRef} />;
}
