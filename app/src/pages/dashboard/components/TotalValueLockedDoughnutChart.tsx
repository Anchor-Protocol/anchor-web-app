import { u, UST } from '@anchor-protocol/types';
import React, { useMemo } from 'react';
import { DoughnutChart } from './DoughnutChart';

export interface TotalValueLockedDoughnutChartProps {
  totalDeposit: u<UST>;
  totalCollaterals: u<UST>;
  totalDepositColor: string;
  totalCollateralsColor: string;
}

export const TotalValueLockedDoughnutChart = (
  props: TotalValueLockedDoughnutChartProps,
): JSX.Element => {
  const descriptors = useMemo(() => {
    return [
      {
        label: 'Total Deposit',
        color: props.totalDepositColor,
        value: +props.totalDeposit,
      },
      {
        label: 'Total Collateral',
        color: props.totalCollateralsColor,
        value: +props.totalCollaterals,
      },
    ];
  }, [
    props.totalCollaterals,
    props.totalCollateralsColor,
    props.totalDeposit,
    props.totalDepositColor,
  ]);

  return <DoughnutChart descriptors={descriptors} />;
};
