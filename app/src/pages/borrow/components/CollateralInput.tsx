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
import { MenuItem, NativeSelect, Select } from '@material-ui/core';
import Big from 'big.js';
import { LayoutSwitch } from 'components/layouts/LayoutSwitch';
import { WhitelistCollateral } from 'queries';
import React, { ChangeEvent } from 'react';
import styled from 'styled-components';

export interface CollateralInputProps extends UIElementProps {
  placeholder?: string;
  collateral: WhitelistCollateral[];
  selected?: WhitelistCollateral;
  amount?: u<CollateralAmount<Big>>;
  onTokenChange: (token: CW20Addr) => void;
  onAmountChange: (amount?: u<CollateralAmount<Big>>) => void;
}

const Component = (props: CollateralInputProps) => {
  const {
    className,
    placeholder = '0.00',
    collateral,
    selected,
    amount,
    onTokenChange,
    onAmountChange,
  } = props;

  // TODO: need to make this a dropdown to change the collateral token

  return (
    <SelectAndTextInputContainer
      className={className}
      gridColumns={[140, '1fr']}
    >
      {/* <SelectAndTextInputContainerLabel>
        <TokenIcon token="beth" symbol={symbol} path={path} />
        {` ${symbol}`}
      </SelectAndTextInputContainerLabel> */}

      <LayoutSwitch
        desktop={
          <Select
            value={selected ? selected.collateral_token : null}
            onChange={(event) => onTokenChange(event.target.value as CW20Addr)}
          >
            {/* <MenuItem value={undefined}></MenuItem> */}
            {collateral.map((c) => {
              return (
                <MenuItem key={c.symbol} value={c.collateral_token}>
                  <SelectAndTextInputContainerLabel>
                    <TokenIcon symbol={c.symbol} path={c.icon} />
                    {c.symbol}
                  </SelectAndTextInputContainerLabel>
                </MenuItem>
              );
            })}
          </Select>
        }
        mobile={
          <NativeSelect>
            {collateral.map((c) => {
              return (
                <option key={c.symbol} value={c.collateral_token}>
                  {c.symbol}
                </option>
              );
            })}
          </NativeSelect>
        }
      />

      {selected && (
        <NumberMuiInput
          placeholder={placeholder}
          value={amount ? demicrofy(amount, selected.decimals ?? 6) : ''}
          maxIntegerPoinsts={LUNA_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={LUNA_INPUT_MAXIMUM_DECIMAL_POINTS}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) => {
            const amount =
              target.value?.length === 0
                ? undefined
                : (Big(microfy(Big(target.value), selected.decimals ?? 6)) as u<
                    CollateralAmount<Big>
                  >);
            onAmountChange(amount);
          }}
        />
      )}
    </SelectAndTextInputContainer>
  );
};

export const CollateralInput = styled(Component)``;
