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
import { useWhitelistCollateralQuery } from 'queries';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { formatOutput, demicrofy } from '@anchor-protocol/formatter';

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

export interface BorrowCollateralInputProps
  extends UIElementProps,
    Pick<
      CollateralInputProps,
      'amount' | 'collateral' | 'onCollateralChange' | 'onAmountChange'
    > {
  maxCollateralAmount: u<CollateralAmount<Big>>;
}

const Component = (props: BorrowCollateralInputProps) => {
  const {
    className,
    amount,
    collateral,
    maxCollateralAmount,
    onCollateralChange,
    onAmountChange,
  } = props;

  const theme = useTheme();

  const { data: whitelist = [] } = useWhitelistCollateralQuery();

  const onLtvChange = useCallback(
    (nextLtv: number) => {
      onAmountChange(
        maxCollateralAmount.mul(trunc(nextLtv)) as u<CollateralAmount<Big>>,
      );
    },
    [onAmountChange, maxCollateralAmount],
  );

  const ratio = amount ? amount.div(maxCollateralAmount).toNumber() : 0;

  return (
    <div className={className}>
      <h2>Collateral amount</h2>
      {collateral && (
        <span className="max-amount">
          <IconSpan>
            Max Amount:
            {` ${formatOutput(
              demicrofy(maxCollateralAmount, collateral.decimals),
            )} ${collateral.symbol}`}
            <InfoTooltip>
              The maximum amount of collateral available to deposit
            </InfoTooltip>
          </IconSpan>
        </span>
      )}
      <CollateralInput
        className="collateral-input"
        whitelist={whitelist}
        amount={amount}
        collateral={collateral}
        onCollateralChange={onCollateralChange}
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
            min={0}
            max={1}
            start={0}
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
  display: grid;
  grid-template-columns: 1fr 1fr;

  h2 {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 10px;
    grid-row: 1;
    grid-column: 1;
  }

  .max-amount {
    grid-row: 1;
    grid-column: 2;
    font-size: 12px;
    color: ${({ theme }) => theme.textColor};
    user-select: none;
    text-align: right;
  }

  .collateral-input {
    grid-row: 2;
    grid-column: 1 / span 2;
  }

  .slider {
    margin-top: 20px;
    grid-row: 3;
    grid-column: 1 / span 2;
  }
`;
