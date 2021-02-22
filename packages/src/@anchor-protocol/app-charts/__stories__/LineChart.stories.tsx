import { APYChart } from '@anchor-protocol/app-charts/APYChart';

export default {
  title: 'anchor/LineChart',
};

export const Basic = () => {
  return (
    <APYChart
      isDevelopment={true}
      style={{ width: '80vw', height: '50vh' }}
      data={[
        { label: 'A', value: 100 },
        { label: 'B', value: 0 },
        { label: 'C', value: 70 },
        { label: 'D', value: 130 },
        { label: 'E', value: 60 },
        { label: 'F', value: 170 },
        { label: 'G', value: 190 },
        { label: 'H', value: 140 },
        { label: 'I', value: 110 },
        { label: 'J', value: 40 },
        { label: 'K', value: 10 },
      ]}
      minY={0}
    />
  );
};
