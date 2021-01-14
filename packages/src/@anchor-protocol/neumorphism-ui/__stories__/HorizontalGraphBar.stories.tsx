import { HorizontalGraphBar } from '@anchor-protocol/neumorphism-ui/components/HorizontalGraphBar';
import styled from 'styled-components';

export default {
  title: 'components/HorizontalGraphBar',
};

type Data = { value: number; color: string };

const data: Data[] = [
  { value: 50, color: '#4da3ee' },
  { value: 0, color: '#ffffff' },
  { value: -50, color: '#ff8a4b' },
];

const colorFunction = ({ color }: Data) => color;
const valueFunction = ({ value }: Data) => value;

export const Basic = () => {
  return (
    <HorizontalGraphBar
      style={{ margin: '50px 0' }}
      min={-100}
      max={100}
      values={data}
      colorFunction={colorFunction}
      valueFunction={valueFunction}
      labelRenderer={({ value }, rect) => {
        return (
          <GraphTick style={{ left: rect.x + rect.width }}>
            VALUE: {value}
          </GraphTick>
        );
      }}
    >
      <GraphLabel style={{ left: 0 }}>Borrow Limit</GraphLabel>
      <GraphLabel style={{ right: 0 }}>$246k</GraphLabel>
    </HorizontalGraphBar>
  );
};

export const CustomShape = () => {
  return (
    <HorizontalGraphBar
      style={{ margin: '50px 0' }}
      min={-100}
      max={100}
      barHeight={30}
      boxRadis={15}
      values={data}
      colorFunction={colorFunction}
      valueFunction={valueFunction}
      labelRenderer={({ value }, rect) => {
        return (
          <GraphTick style={{ left: rect.x + rect.width }}>
            VALUE: {value}
          </GraphTick>
        );
      }}
    >
      <GraphLabel style={{ top: 40, left: 0 }}>Borrow Limit</GraphLabel>
      <GraphLabel style={{ top: 40, right: 0 }}>$246k</GraphLabel>
    </HorizontalGraphBar>
  );
};

const GraphTick = styled.span`
  font-size: 14px;
  font-weight: 300;
  color: ${({ theme }) => theme.dimTextColor};

  top: -28px;
  transform: translateX(-50%);

  &::before {
    content: '';
    height: 8px;
    border-left: solid 1px currentColor;
    position: absolute;
    left: calc(50% - 1px);
    bottom: -11px;
    z-index: 1;
  }
`;

const GraphLabel = styled.span`
  font-size: 15px;
  color: ${({ theme }) => theme.textColor};
  top: 22px;
`;
