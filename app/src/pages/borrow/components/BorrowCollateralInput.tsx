import { useWhitelistCollateralQuery } from '@anchor-protocol/app-provider';
import { CollateralAmount, u } from '@anchor-protocol/types';
import {
  HorizontalGraphBar,
  Rect,
} from '@libs/neumorphism-ui/components/HorizontalGraphBar';
import { HorizontalGraphSlider } from '@libs/neumorphism-ui/components/HorizontalGraphSlider';
import Big from 'big.js';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { CollateralInput, CollateralInputProps } from './CollateralInput';
import { useTheme } from 'styled-components';
import { formatDemimal } from '@libs/formatter';
import { UIElementProps } from 'components/layouts/UIElementProps';

interface Data {
  label: string;
  value: number;
  color: string;
}

const Label = styled.span`
  margin-top: 10px;

  > span {
    display: inline-block;

    font-size: 12px;
    font-weight: 500;

    transform: translateX(-50%);

    user-select: none;

    word-break: keep-all;
    white-space: nowrap;
  }
`;

const valueFunction = ({ value }: Data) => value;

const labelRenderer = ({ label, color }: Data, rect: Rect, i: number) => {
  return (
    <Label key={'label' + i} style={{ left: rect.x + rect.width, color }}>
      <span>{label}</span>
    </Label>
  );
};

const formatter = formatDemimal({
  decimalPoints: 2,
  delimiter: true,
});

const trunc = (value: number): number => {
  return Math.trunc(value * 1000) / 1000;
};

interface BorrowCollateralInputProps
  extends UIElementProps,
    Pick<CollateralInputProps, 'amount' | 'onAmountChange'> {}

const Component = (props: BorrowCollateralInputProps) => {
  const { className, amount, onAmountChange } = props;

  const theme = useTheme();

  const { data: whitelist = [] } = useWhitelistCollateralQuery();

  const minCollateralAmount = Big(3410000) as u<CollateralAmount<Big>>;

  // TODO: need to fetch this with a callback like onBalanceRequested
  const maxCollateralAmount = Big(10000000) as u<CollateralAmount<Big>>;

  const onLtvChange = useCallback(
    (nextLtv: number) => {
      onAmountChange(
        Big(maxCollateralAmount).mul(trunc(nextLtv)) as u<
          CollateralAmount<Big>
        >,
      );
    },
    [onAmountChange, maxCollateralAmount],
  );

  const minRatio = minCollateralAmount.div(maxCollateralAmount).toNumber();

  // const ratio = amount
  //   ? minCollateralAmount.plus(amount).div(maxCollateralAmount).toNumber()
  //   : 0;

  // const ratio = minCollateralAmount
  //   .plus(amount ?? 0)
  //   .div(maxCollateralAmount)
  //   .toNumber();

  //HERE: probably should start with the current amount and allow to withdraw perhaps?

  const ratio = amount ? amount.div(maxCollateralAmount).toNumber() : 0;

  return (
    <div className={className}>
      <h2>Collateral amount</h2>
      <CollateralInput
        collateral={whitelist}
        amount={amount}
        onTokenChange={(value) => {}}
        onAmountChange={onAmountChange}
      />
      <HorizontalGraphBar<Data>
        className="slider"
        min={0}
        max={1}
        data={[
          {
            label: `${ratio < 1 ? formatter(ratio * 100) : '100'}%`,
            value: Math.max(Math.min(ratio, 1), 0),
            color: theme.colors.positive,
          },
        ]}
        colorFunction={() => theme.colors.positive}
        valueFunction={valueFunction}
        labelRenderer={labelRenderer}
      >
        {(coordinateSpace) => (
          <HorizontalGraphSlider
            coordinateSpace={coordinateSpace}
            min={minRatio}
            max={1}
            start={minRatio}
            end={1}
            value={ratio}
            onChange={onLtvChange}
            stepFunction={trunc}
          />
        )}
      </HorizontalGraphBar>
    </div>
  );
};

export const BorrowCollateralInput = styled(Component)`
  margin-top: 30px;
  margin-bottom: 50px;

  h2 {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 10px;
  }

  .slider {
    margin-top: 20px;
  }
`;
