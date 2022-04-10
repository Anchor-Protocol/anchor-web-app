import { CollateralAmount, u } from '@anchor-protocol/types';
import { HorizontalGraphBar } from '@libs/neumorphism-ui/components/HorizontalGraphBar';
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
import { floor } from '@libs/big-math';

interface Data {
  value: number;
  color: string;
}

const valueFunction = ({ value }: Data) => value;

const colorFunction = ({ color }: Data) => color;

const formatter = formatDemimal({
  decimalPoints: 0,
  delimiter: true,
});

const trunc = (value: number): number => {
  return Math.trunc(value * 100) / 100;
};

export interface BorrowCollateralInputProps
  extends UIElementProps,
    Pick<
      CollateralInputProps,
      'amount' | 'collateral' | 'onCollateralChange' | 'onAmountChange'
    > {
  maxCollateralAmount?: u<CollateralAmount<Big>>;
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
      if (maxCollateralAmount) {
        onAmountChange(
          floor(maxCollateralAmount.mul(trunc(nextLtv))) as u<
            CollateralAmount<Big>
          >,
        );
      }
    },
    [onAmountChange, maxCollateralAmount],
  );

  const ratio =
    amount && maxCollateralAmount && maxCollateralAmount.gt(0)
      ? amount.div(maxCollateralAmount).toNumber()
      : 0;

  return (
    <div className={className}>
      <CollateralInput
        className="collateral-input"
        whitelist={whitelist.filter((c) => c.bridgedAddress)}
        amount={amount}
        collateral={collateral}
        onCollateralChange={onCollateralChange}
        onAmountChange={onAmountChange}
      />
      <span className="warning">{warningMessage}</span>
      {collateral && maxCollateralAmount && (
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
      <HorizontalGraphBar<Data>
        className="slider"
        min={0}
        max={1}
        data={[
          {
            value: Math.max(Math.min(ratio, 1), 0),
            color: Boolean(warningMessage)
              ? theme.colors.negative
              : theme.colors.positive,
          },
        ]}
        colorFunction={colorFunction}
        valueFunction={valueFunction}
      >
        {(coordinateSpace) => (
          <HorizontalGraphSlider
            coordinateSpace={coordinateSpace}
            disabled={collateral === undefined}
            min={0}
            max={1}
            start={0}
            end={1}
            value={ratio}
            onChange={onLtvChange}
            stepFunction={trunc}
            label={`${ratio < 1 ? formatter(ratio * 100) : '100'}%`}
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
