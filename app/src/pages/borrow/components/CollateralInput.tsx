import { microfy } from '@anchor-protocol/formatter';
import {
  LUNA_INPUT_MAXIMUM_INTEGER_POINTS,
  LUNA_INPUT_MAXIMUM_DECIMAL_POINTS,
} from '@anchor-protocol/notation';
import { TokenIcon } from '@anchor-protocol/token-icons';
import { CollateralAmount, u } from '@anchor-protocol/types';
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
import React, { ChangeEvent, useCallback } from 'react';
import styled from 'styled-components';

export interface CollateralInputProps extends UIElementProps {
  placeholder?: string;
  whitelist: WhitelistCollateral[];
  collateral?: WhitelistCollateral;
  onCollateralChange: (collateral: WhitelistCollateral) => void;
  amount?: u<CollateralAmount<Big>>;
  onAmountChange: (amount?: u<CollateralAmount<Big>>) => void;
}

const Component = (props: CollateralInputProps) => {
  const {
    className,
    placeholder = '0.00',
    whitelist,
    collateral,
    amount,
    onCollateralChange,
    onAmountChange,
  } = props;

  const handleCollateralChanged = useCallback(
    (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
      const found = whitelist.find(
        (c) => c.collateral_token === event.target.value,
      );
      if (found && onCollateralChange) {
        onCollateralChange(found);
      }
    },
    [onCollateralChange, whitelist],
  );

  return (
    <SelectAndTextInputContainer
      className={className}
      gridColumns={[140, '1fr']}
    >
      <LayoutSwitch
        desktop={
          <Select
            value={collateral?.collateral_token ?? ''}
            onChange={handleCollateralChanged}
          >
            {whitelist.map((collateral) => {
              return (
                <MenuItem
                  key={collateral.symbol}
                  value={collateral.collateral_token}
                >
                  <SelectAndTextInputContainerLabel>
                    <TokenIcon
                      symbol={collateral.symbol}
                      path={collateral.icon}
                    />
                    {collateral.symbol}
                  </SelectAndTextInputContainerLabel>
                </MenuItem>
              );
            })}
          </Select>
        }
        mobile={
          <NativeSelect
            value={collateral?.collateral_token ?? ''}
            onChange={handleCollateralChanged}
          >
            {whitelist.map((collateral) => {
              return (
                <option
                  key={collateral.symbol}
                  value={collateral.collateral_token}
                >
                  {collateral.symbol}
                </option>
              );
            })}
          </NativeSelect>
        }
      />

      {collateral && (
        <NumberMuiInput
          placeholder={placeholder}
          value={amount ? demicrofy(amount, collateral.decimals ?? 6) : ''}
          maxIntegerPoinsts={LUNA_INPUT_MAXIMUM_INTEGER_POINTS}
          maxDecimalPoints={LUNA_INPUT_MAXIMUM_DECIMAL_POINTS}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) => {
            const amount =
              target.value?.length === 0
                ? undefined
                : (Big(
                    microfy(Big(target.value), collateral.decimals ?? 6),
                  ) as u<CollateralAmount<Big>>);
            onAmountChange(amount);
          }}
        />
      )}
    </SelectAndTextInputContainer>
  );
};

export const CollateralInput = styled(Component)``;
