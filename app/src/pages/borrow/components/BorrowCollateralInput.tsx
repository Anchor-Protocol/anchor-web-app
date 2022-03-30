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

const colorFunction = ({ color }: Data) => color;

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
  warningMessage?: string;
}

const Component = (props: BorrowCollateralInputProps) => {
  const {
    className,
    amount,
    collateral,
    maxCollateralAmount,
    warningMessage,
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

  const ratio =
    amount && maxCollateralAmount.gt(0)
      ? amount.div(maxCollateralAmount).toNumber()
      : 0;

  return (
    <div className={className}>
      <h2>Collateral amount</h2>
      <CollateralInput
        className="collateral-input"
        whitelist={whitelist}
        amount={amount}
        collateral={collateral}
        onCollateralChange={onCollateralChange}
        onAmountChange={onAmountChange}
      />
      <span className="warning">{warningMessage}</span>
      {collateral && (
        <span className="wallet" aria-invalid={Boolean(warningMessage)}>
          <span>Wallet: </span>
          <span
            style={{
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
            onClick={() => {
              onAmountChange(maxCollateralAmount);
            }}
          >
            {` ${formatOutput(
              demicrofy(maxCollateralAmount, collateral.decimals),
            )} ${collateral.symbol} `}
          </span>
        </span>
      )}
      {collateral && (
        <HorizontalGraphBar<Data>
          className="slider"
          min={0}
          max={1}
          data={[
            {
              label: `${ratio < 1 ? formatter(ratio * 100) : '100'}%`,
              value: Math.max(Math.min(ratio, 1), 0),
              color: Boolean(warningMessage)
                ? theme.colors.negative
                : theme.colors.positive,
            },
          ]}
          colorFunction={colorFunction}
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
      )}
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

  .wallet {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    margin-top: 5px;
    grid-row: 3;
    grid-column: 2;

    span:first-child {
      margin-left: auto;
      margin-right: 5px;
    }

    &[aria-invalid='true'] {
      color: ${({ theme }) => theme.colors.negative};
    }
  }

  .warning {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.negative};
    margin-top: 5px;
    grid-row: 3;
    grid-column: 1;
  }

  .slider {
    margin-top: 20px;
    grid-row: 4;
    grid-column: 1 / span 2;
  }
`;
