import { useRestrictedNumberInput } from '@libs/use-restricted-input';
import React, {
  ChangeEvent,
  DetailedHTMLProps,
  InputHTMLAttributes,
  useCallback,
} from 'react';
import { EmptyTextInput } from './EmptyTextInput';

export interface EmptyNumberInputProps<T extends string>
  extends Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'onChange' | 'defaultValue' | 'value' | 'type' | 'ref'
  > {
  value: T;
  onChange: (nextValue: T) => void;
  type?: 'decimal' | 'integer';
  maxDecimalPoints?: number;
  maxIntegerPoints?: number;
}

export function EmptyNumberInput<T extends string>({
  type = 'decimal',
  pattern = '[0-9.]*',
  value,
  onChange,
  maxDecimalPoints,
  maxIntegerPoints,
  ...inputProps
}: EmptyNumberInputProps<T>) {
  const inputOnChange = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      onChange(target.value as T);
    },
    [onChange],
  );

  const handlers = useRestrictedNumberInput({
    type,
    maxIntegerPoinsts: maxIntegerPoints,
    maxDecimalPoints,
    onChange: inputOnChange,
  });

  return (
    <EmptyTextInput
      {...inputProps}
      {...handlers}
      type="text"
      value={value}
      pattern={pattern}
    />
  );
}
