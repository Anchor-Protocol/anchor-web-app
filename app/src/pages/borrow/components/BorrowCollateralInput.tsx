import {
  LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
  LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
} from '@anchor-protocol/notation';
import { TokenIcon } from '@anchor-protocol/token-icons';
import { CollateralAmount } from '@anchor-protocol/types';
import { NumberMuiInput } from '@libs/neumorphism-ui/components/NumberMuiInput';
import {
  SelectAndTextInputContainer,
  SelectAndTextInputContainerLabel,
} from '@libs/neumorphism-ui/components/SelectAndTextInputContainer';
import { UIElementProps } from '@libs/ui';
import { BigSource } from 'big.js';
import React, { ChangeEvent } from 'react';
import styled from 'styled-components';
//import { LTVGraph } from './LTVGraph';

interface CollateralInputProps extends UIElementProps {
  symbol: string;
  path?: string;
  amount: CollateralAmount<BigSource>;
  onChange: (amount: CollateralAmount<BigSource>) => void;
}

const CollateralInputComponent = (props: CollateralInputProps) => {
  const { className, symbol, path, amount, onChange } = props;

  return (
    <SelectAndTextInputContainer
      className={className}
      gridColumns={[140, '1fr']}
    >
      <SelectAndTextInputContainerLabel>
        <TokenIcon token="beth" symbol={symbol} path={path} />
        {` ${symbol}`}
      </SelectAndTextInputContainerLabel>
      <NumberMuiInput
        placeholder="0.00"
        value={amount}
        maxIntegerPoinsts={LUNA_INPUT_MAXIMUM_INTEGER_POINTS}
        maxDecimalPoints={LUNA_INPUT_MAXIMUM_DECIMAL_POINTS}
        onChange={({ target }: ChangeEvent<HTMLInputElement>) => {
          onChange(target.value as CollateralAmount);
        }}
      />
    </SelectAndTextInputContainer>
  );
};

const CollateralInput = styled(CollateralInputComponent)`
  .root {
  }
`;

interface BorrowCollateralInputProps extends CollateralInputProps {}

const BorrowCollateralInputComponent = (props: BorrowCollateralInputProps) => {
  const {
    // className,
    // symbol,
    // path,
    amount,
    //onChange
  } = props;

  return (
    <>
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
      <CollateralInput symbol="bETH" amount={amount} onChange={(value) => {}} />
    </>
  );
};

export const BorrowCollateralInput = styled(BorrowCollateralInputComponent)`
  .root {
  }
`;
