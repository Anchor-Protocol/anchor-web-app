import { APYChart } from '@anchor-protocol/webapp-charts/APYChart';
import { Rate } from '@anchor-protocol/types';
import React from 'react';

export default {
  title: 'anchor/APYChart',
};

export const Basic = () => {
  return (
    <APYChart
      style={{ width: '80vw', height: '50vh' }}
      data={[
        { date: new Date(), value: (100 / 100) as Rate<number> },
        { date: new Date(), value: (0 / 100) as Rate<number> },
        { date: new Date(), value: (70 / 100) as Rate<number> },
        { date: new Date(), value: (130 / 100) as Rate<number> },
        { date: new Date(), value: (60 / 100) as Rate<number> },
        { date: new Date(), value: (170 / 100) as Rate<number> },
        { date: new Date(), value: (190 / 100) as Rate<number> },
        { date: new Date(), value: (140 / 100) as Rate<number> },
        { date: new Date(), value: (110 / 100) as Rate<number> },
        { date: new Date(), value: (40 / 100) as Rate<number> },
        { date: new Date(), value: (10 / 100) as Rate<number> },
      ]}
      minY={() => 0}
    />
  );
};
