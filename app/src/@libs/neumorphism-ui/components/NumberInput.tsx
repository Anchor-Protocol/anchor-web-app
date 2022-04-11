import {
  RestrictedNumberInputParams,
  useRestrictedNumberInput,
} from '@libs/use-restricted-input';
import React from 'react';
import { TextInput, TextInputProps } from './TextInput';

export type NumberInputProps = Omit<TextInputProps, 'type'> &
  RestrictedNumberInputParams;

export function NumberInput({
  type = 'decimal',
  maxDecimalPoints,
  maxIntegerPoinsts,
  onChange,
  inputMode = type === 'decimal' ? 'decimal' : 'numeric',
  pattern = '[0-9.]*',
  disableBorder,
  ...props
}: NumberInputProps) {
  const handlers = useRestrictedNumberInput({
    type,
    maxIntegerPoinsts,
    maxDecimalPoints,
    onChange,
  });
  return (
    <TextInput
      {...props}
      disableBorder={disableBorder}
      type="text"
      inputProps={{
        inputMode,
        pattern,
      }}
      {...handlers}
    />
  );
}
