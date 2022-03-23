import { microfy } from '@anchor-protocol/formatter';
import {
  LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
  LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
} from '@anchor-protocol/notation';
import { TokenIcon } from '@anchor-protocol/token-icons';
import { CollateralAmount, CW20Addr, u } from '@anchor-protocol/types';
import { demicrofy } from '@libs/formatter';
import { NumberMuiInput } from '@libs/neumorphism-ui/components/NumberMuiInput';
import {
  SelectAndTextInputContainer,
  SelectAndTextInputContainerLabel,
} from '@libs/neumorphism-ui/components/SelectAndTextInputContainer';
import { UIElementProps } from '@libs/ui';
import Big from 'big.js';
import React, { ChangeEvent } from 'react';
import styled from 'styled-components';

export interface CollateralInputProps extends UIElementProps {
  symbol: string;
  path?: string;
  decimals: number;
  amount?: u<CollateralAmount<Big>>;
  onTokenChange: (token: CW20Addr) => void;
  onAmountChange: (amount?: u<CollateralAmount<Big>>) => void;
}

const Component = (props: CollateralInputProps) => {
  const { className, symbol, path, decimals, amount, onAmountChange } = props;

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
        value={amount ? demicrofy(amount, decimals) : ''}
        maxIntegerPoinsts={LUNA_INPUT_MAXIMUM_INTEGER_POINTS}
        maxDecimalPoints={LUNA_INPUT_MAXIMUM_DECIMAL_POINTS}
        onChange={({ target }: ChangeEvent<HTMLInputElement>) => {
          const amount =
            target.value?.length === 0
              ? undefined
              : (Big(microfy(Big(target.value), decimals)) as u<
                  CollateralAmount<Big>
                >);

          onAmountChange(amount);
        }}
      />
    </SelectAndTextInputContainer>
  );
};

export const CollateralInput = styled(Component)``;
