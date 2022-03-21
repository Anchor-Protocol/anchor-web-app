import {
  LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
  LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
} from '@anchor-protocol/notation';
import { TokenIcon } from '@anchor-protocol/token-icons';
import { CollateralAmount, CW20Addr } from '@anchor-protocol/types';
import { NumberMuiInput } from '@libs/neumorphism-ui/components/NumberMuiInput';
import {
  SelectAndTextInputContainer,
  SelectAndTextInputContainerLabel,
} from '@libs/neumorphism-ui/components/SelectAndTextInputContainer';
import { UIElementProps } from '@libs/ui';
import React, { ChangeEvent } from 'react';
import styled from 'styled-components';

export interface CollateralInputProps extends UIElementProps {
  symbol: string;
  path?: string;
  amount: CollateralAmount;
  onTokenChange: (token: CW20Addr) => void;
  onAmountChange: (amount: CollateralAmount) => void;
}

const Component = (props: CollateralInputProps) => {
  const { className, symbol, path, amount, onAmountChange } = props;

  // TODO: need to make this a dropdown to change the collateral token

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
          onAmountChange(target.value as CollateralAmount);
        }}
      />
    </SelectAndTextInputContainer>
  );
};

export const CollateralInput = styled(Component)`
  .root {
  }
`;
