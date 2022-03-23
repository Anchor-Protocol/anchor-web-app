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

interface Data {
  label: string;
  value: number;
  color: string;
}

const Label = styled.span`
  top: -28px;

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

interface BorrowCollateralInputProps
  extends Pick<CollateralInputProps, 'amount' | 'onAmountChange'> {}

const Component = (props: BorrowCollateralInputProps) => {
  const { amount, onAmountChange } = props;

  const theme = useTheme();

  const { data: whitelist = [] } = useWhitelistCollateralQuery();

  const maxCollateralAmount = Big(10000000) as u<CollateralAmount<Big>>;

  const onLtvChange = useCallback(
    (nextLtv: number) => {
      onAmountChange(
        Big(maxCollateralAmount).mul(nextLtv) as u<CollateralAmount<Big>>,
      );
    },
    [onAmountChange, maxCollateralAmount],
  );

  const ratio = amount ? amount.div(maxCollateralAmount).toNumber() : 0;

  return (
    <>
      <CollateralInput
        collateral={whitelist}
        amount={amount}
        onTokenChange={(value) => {}}
        onAmountChange={onAmountChange}
      />
      <figure className="graph">
        <HorizontalGraphBar<Data>
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
            />
          )}
        </HorizontalGraphBar>
      </figure>
    </>
  );
};

export const BorrowCollateralInput = styled(Component)``;
