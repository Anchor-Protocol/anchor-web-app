import { AnimateNumber } from '@libs/ui';
import { floor } from '@libs/big-math';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { HorizontalGraphBar } from '@libs/neumorphism-ui/components/HorizontalGraphBar';
import { HorizontalGraphSlider } from '@libs/neumorphism-ui/components/HorizontalGraphSlider';
import { sliderStep } from '@libs/neumorphism-ui/components/sliderStep';
import React, { useCallback, useState } from 'react';
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
      data={data}
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

export const OverData = () => {
  return (
    <HorizontalGraphBar
      style={{ margin: '50px 0' }}
      min={0}
      max={100}
      data={[{ value: 150, color: '#4da3ee' }]}
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

export const Animate = () => {
  const [data, setData] = useState(() => [{ value: 50, color: '#4da3ee' }]);

  const updateData = useCallback(() => {
    setData([
      {
        value: Math.floor(Math.random() * 1000),
        color: Math.random() > 0.5 ? '#4da3ee' : '#ff8a4b',
      },
    ]);
  }, []);

  const emptyData = useCallback(() => {
    setData([
      {
        value: 0,
        color: Math.random() > 0.5 ? '#4da3ee' : '#ff8a4b',
      },
    ]);
  }, []);

  return (
    <div>
      <HorizontalGraphBar
        style={{ margin: '50px 0' }}
        animate
        min={0}
        max={1000}
        data={data}
        colorFunction={colorFunction}
        valueFunction={valueFunction}
        labelRenderer={({ value }, rect) => {
          return (
            <AnimateGraphTick
              style={{
                transform: `translateX(${rect.x + rect.width}px)`,
                opacity: value > 0 ? 1 : 0,
              }}
            >
              <span>
                VALUE:{' '}
                <AnimateNumber format={(v) => floor(v).toFixed()}>
                  {value}
                </AnimateNumber>
              </span>
            </AnimateGraphTick>
          );
        }}
      >
        <GraphLabel style={{ left: 0 }}>Borrow Limit</GraphLabel>
        <GraphLabel style={{ right: 0 }}>$246k</GraphLabel>
      </HorizontalGraphBar>

      <ActionButton style={{ width: 150 }} onClick={updateData}>
        Random Data
      </ActionButton>

      <ActionButton style={{ width: 150, marginLeft: 10 }} onClick={emptyData}>
        Empty Data
      </ActionButton>
    </div>
  );
};

export const Animate_Multiple = () => {
  const [data, setData] = useState(() => [
    { value: 500, color: '#4da3ee' },
    { value: 300, color: '#ffffff' },
    { value: 100, color: '#ff8a4b' },
  ]);

  const updateData = useCallback(() => {
    const rand1 = Math.floor(Math.random() * 500) + 500;
    const rand2 = rand1 - Math.floor(Math.random() * 200);
    const rand3 = rand2 - Math.floor(Math.random() * 200);

    setData([
      { value: rand1, color: '#4da3ee' },
      { value: rand2, color: '#ffffff' },
      { value: rand3, color: '#ff8a4b' },
    ]);
  }, []);

  const emptyData = useCallback(() => {
    setData([
      { value: 0, color: '#4da3ee' },
      { value: 0, color: '#ffffff' },
      { value: 0, color: '#ff8a4b' },
    ]);
  }, []);

  return (
    <div>
      <HorizontalGraphBar
        style={{ margin: '50px 0' }}
        animate
        min={0}
        max={1000}
        data={data}
        colorFunction={colorFunction}
        valueFunction={valueFunction}
        labelRenderer={({ value }, rect, i) => {
          return (
            <AnimateGraphTick
              key={'label' + i}
              style={{
                transform: `translateX(${rect.x + rect.width}px)`,
                opacity: value > 0 ? 1 : 0,
              }}
            >
              <span>
                VALUE:{' '}
                <AnimateNumber format={(v) => floor(v).toFixed()}>
                  {value}
                </AnimateNumber>
              </span>
            </AnimateGraphTick>
          );
        }}
      >
        <GraphLabel style={{ left: 0 }}>Borrow Limit</GraphLabel>
        <GraphLabel style={{ right: 0 }}>$246k</GraphLabel>
      </HorizontalGraphBar>

      <ActionButton style={{ width: 150 }} onClick={updateData}>
        Random Data
      </ActionButton>

      <ActionButton style={{ width: 150, marginLeft: 10 }} onClick={emptyData}>
        Empty Data
      </ActionButton>
    </div>
  );
};

export const MaxTick = () => {
  return (
    <HorizontalGraphBar
      style={{ margin: '50px 0' }}
      min={-100}
      max={0}
      data={data}
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
      boxRadius={15}
      data={data}
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

export const Slider = () => {
  const min = -100;
  const max = 100;

  const [value, setValue] = useState<number>(() => 0);

  return (
    <HorizontalGraphBar
      style={{ margin: '50px 0' }}
      min={min}
      max={max}
      data={[
        { value: -50, color: 'transparent' },
        { value: 50, color: 'transparent' },
        {
          value,
          color: value < -20 ? 'red' : value > 20 ? 'green' : '#ffffff',
        },
      ]}
      colorFunction={colorFunction}
      valueFunction={valueFunction}
      labelRenderer={({ value }, rect) => {
        return (
          <GraphTick style={{ left: rect.x + rect.width }}>
            VALUE: {value.toFixed(0)}
          </GraphTick>
        );
      }}
    >
      {(coordinateSpace) => (
        <>
          <HorizontalGraphSlider
            coordinateSpace={coordinateSpace}
            min={min}
            max={max}
            start={-50}
            end={50}
            value={value}
            onChange={setValue}
          />
          <GraphLabel style={{ top: 40, left: 0 }}>Borrow Limit</GraphLabel>
          <GraphLabel style={{ top: 40, right: 0 }}>$246k</GraphLabel>
        </>
      )}
    </HorizontalGraphBar>
  );
};

export const SliderStep = () => {
  const min = -100;
  const max = 100;

  const [value, setValue] = useState<number>(() => 0);

  return (
    <HorizontalGraphBar
      style={{ margin: '50px 0' }}
      min={min}
      max={max}
      data={[
        { value: -50, color: 'transparent' },
        { value: 50, color: 'transparent' },
        {
          value,
          color: value < -20 ? 'red' : value > 20 ? 'green' : '#ffffff',
        },
      ]}
      colorFunction={colorFunction}
      valueFunction={valueFunction}
      labelRenderer={({ value }, rect) => {
        return (
          <GraphTick style={{ left: rect.x + rect.width }}>
            VALUE: {value.toFixed(0)}
          </GraphTick>
        );
      }}
    >
      {(coordinateSpace) => (
        <>
          <HorizontalGraphSlider
            coordinateSpace={coordinateSpace}
            stepFunction={sliderStep(10)}
            min={min}
            max={max}
            start={-50}
            end={50}
            value={value}
            onChange={setValue}
          />
        </>
      )}
    </HorizontalGraphBar>
  );
};

const GraphTick = styled.span`
  font-size: 14px;
  font-weight: 300;
  color: ${({ theme }) => theme.dimTextColor};

  top: -28px;
  transform: translateX(-50%);

  word-break: keep-all;
  white-space: nowrap;

  user-select: none;

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

const AnimateGraphTick = styled.span`
  top: -28px;

  > span {
    display: inline-block;

    font-size: 14px;
    font-weight: 300;
    color: ${({ theme }) => theme.dimTextColor};

    transform: translateX(-50%);

    word-break: keep-all;
    white-space: nowrap;

    user-select: none;

    &::before {
      content: '';
      height: 8px;
      border-left: solid 1px currentColor;
      position: absolute;
      left: calc(50% - 1px);
      bottom: -11px;
      z-index: 1;
    }
  }
`;

const GraphLabel = styled.span`
  font-size: 15px;
  color: ${({ theme }) => theme.textColor};
  top: 22px;

  user-select: none;
`;
