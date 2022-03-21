import { CollateralAmount } from '@anchor-protocol/types';
import React from 'react';
import styled from 'styled-components';
import { CollateralInput, CollateralInputProps } from './CollateralInput';
//import { LTVGraph } from './LTVGraph';

interface BorrowCollateralInputProps extends CollateralInputProps {
  maxAmount: CollateralAmount;
}

const BorrowCollateralInputComponent = (props: BorrowCollateralInputProps) => {
  const {
    // className,
    // symbol,
    // path,
    amount,
    onTokenChange,
    onAmountChange,
  } = props;

  return (
    <>
      <CollateralInput
        symbol="bLUNA"
        amount={amount}
        onTokenChange={onTokenChange}
        onAmountChange={onAmountChange}
      />
      <figure className="graph">
        {/* <LTVGraph
          disabled={!connected || states.max.lte(0)}
          borrowLimit={states.borrowLimit}
          start={states.currentLtv?.toNumber() ?? 0}
          end={ANCHOR_DANGER_RATIO}
          value={states.nextLtv}
          onChange={onLtvChange}
          onStep={states.ltvStepFunction}
        /> */}
      </figure>
    </>
  );
};

export const BorrowCollateralInput = styled(BorrowCollateralInputComponent)`
  .root {
  }
`;
