import { CoinChart } from '@anchor-protocol/webapp-charts/CoinChart';
import React from 'react';

export default {
  title: 'anchor/CoinChart',
};

export const Basic = () => {
  return (
    <CoinChart
      style={{ width: '80vw', height: '50vh' }}
      data={[
        { label: 'A', apy: 0.72, total: 10 },
        { label: 'B', apy: 0, total: 24 },
        { label: 'C', apy: 0.46, total: 17 },
        { label: 'D', apy: 0.4, total: 14 },
        { label: 'E', apy: 0.7, total: 23 },
        { label: 'F', apy: 0.9, total: 26 },
        { label: 'G', apy: 1.2, total: 56 },
        { label: 'H', apy: 0.5, total: 45 },
        { label: 'I', apy: 0.2, total: 70 },
        { label: 'J', apy: 0.45, total: 100 },
        { label: 'K', apy: 0.8, total: 92 },
      ]}
    />
  );
};
