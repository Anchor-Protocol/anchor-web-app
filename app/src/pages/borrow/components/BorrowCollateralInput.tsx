import { CollateralAmount, Rate, u } from '@anchor-protocol/types';
import Big from 'big.js';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { CollateralInput, CollateralInputProps } from './CollateralInput';
import { LTVGraph } from './LTVGraph';

interface BorrowCollateralInputProps extends CollateralInputProps {
  maxCollateralAmount: u<CollateralAmount<Big>>;
  collateralLtv: Rate<Big>;
}

const Component = (props: BorrowCollateralInputProps) => {
  const {
    // className,
    // symbol,
    // path,
    decimals,
    amount,
    onTokenChange,
    onAmountChange,
    maxCollateralAmount,
    collateralLtv,
  } = props;

  const onChange = useCallback(
    (nextLtv: Rate<Big>) => {
      // onAmountChange(
      //   Big(maxCollateralAmount).mul(nextLtv).toString() as u<
      //     CollateralAmount<string>
      //   >,
      // );
      console.log(maxCollateralAmount);
    },
    [maxCollateralAmount],
  );

  return (
    <>
      <CollateralInput
        symbol="bLUNA"
        decimals={decimals}
        amount={amount}
        onTokenChange={onTokenChange}
        onAmountChange={onAmountChange}
      />
      <figure className="graph">
        <LTVGraph
          start={0}
          end={1}
          value={collateralLtv}
          onChange={onChange}
          onStep={(step) => {
            return step;
          }}
        />
      </figure>
    </>
  );
};

export const BorrowCollateralInput = styled(Component)``;
