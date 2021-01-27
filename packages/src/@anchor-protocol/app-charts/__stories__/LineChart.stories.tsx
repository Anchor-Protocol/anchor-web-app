import { LineChart } from '@anchor-protocol/app-charts/LineChart';

export default {
  title: 'anchor/LineChart',
};

export const Basic = () => {
  return (
    <LineChart
      style={{ width: '50vw', height: '50vh' }}
      data={[
        { label: 'A', date: 0, value: 100 },
        { label: 'B', date: 1, value: 10 },
        { label: 'C', date: 2, value: 70 },
        { label: 'D', date: 3, value: 130 },
        { label: 'E', date: 4, value: 60 },
        { label: 'F', date: 5, value: 170 },
      ]}
    />
  );
};
