import { microfy } from '@anchor-protocol/formatter';
import { TokenIcon } from '@anchor-protocol/token-icons';
import { CollateralAmount, u } from '@anchor-protocol/types';
import { demicrofy } from '@libs/formatter';
import { NumberInput } from '@libs/neumorphism-ui/components/NumberInput';
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

interface OptionProps extends UIElementProps {
  collateral: WhitelistCollateral;
}

const MenuItemContentComponent = (props: OptionProps) => {
  const { className, collateral } = props;
  return (
    <SelectAndTextInputContainerLabel className={className}>
      <TokenIcon symbol={collateral.symbol} path={collateral.icon} />
      {collateral.symbol}
    </SelectAndTextInputContainerLabel>
  );
};

const MenuItemContent = styled(MenuItemContentComponent)`
  justify-content: flex-end;
  img {
    font-size: 12px;
  }
`;

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
    placeholder,
    whitelist,
    collateral,
    amount,
    onCollateralChange,
    onAmountChange,
  } = props;

  const onCollateralChanged = useCallback(
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
      gridColumns={['1fr', 160]}
      gutters="none"
      disableColumnDivider={true}
    >
      <NumberInput
        label="COLLATERAL AMOUNT"
        placeholder={placeholder}
        disableBorder={true}
        disabled={collateral === undefined}
        value={amount ? demicrofy(amount, collateral?.decimals ?? 6) : ''}
        onChange={({ target }: ChangeEvent<HTMLInputElement>) => {
          if (collateral) {
            const amount =
              target.value?.length === 0
                ? undefined
                : (Big(
                    microfy(Big(target.value), collateral.decimals ?? 6),
                  ) as u<CollateralAmount<Big>>);

            onAmountChange(amount);
          }
        }}
      />
      <LayoutSwitch
        desktop={
          <Select
            classes={{
              select: 'select',
              icon: 'icon',
            }}
            value={collateral?.collateral_token ?? ''}
            onChange={onCollateralChanged}
          >
            {whitelist.map((collateral) => {
              return (
                <MenuItem
                  key={collateral.symbol}
                  value={collateral.collateral_token}
                  disableRipple={true}
                >
                  <MenuItemContent collateral={collateral} />
                </MenuItem>
              );
            })}
          </Select>
        }
        mobile={
          <NativeSelect
            value={collateral?.collateral_token ?? ''}
            onChange={onCollateralChanged}
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
    </SelectAndTextInputContainer>
  );
};

export const CollateralInput = styled(Component)`
  .select {
    margin-right: 16px;
    &:focus {
      background-color: transparent;
    }
  }

  .icon {
    margin-right: 12px;
  }
`;
