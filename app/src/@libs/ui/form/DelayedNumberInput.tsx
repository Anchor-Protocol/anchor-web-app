import { useRestrictedNumberInput } from '@libs/use-restricted-input';
import { useStateRef } from '@libs/use-state-ref';
import React, {
  ChangeEvent,
  DetailedHTMLProps,
  InputHTMLAttributes,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { EmptyTextInput } from './EmptyTextInput';

export interface DelayedNumberInputProps<T extends string>
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

export function DelayedNumberInput<T extends string>({
  type = 'decimal',
  pattern = '[0-9.]*',
  value,
  onChange,
  maxDecimalPoints,
  maxIntegerPoints,
  ...inputProps
}: DelayedNumberInputProps<T>) {
  const [internalValue, setInternalValue] = useState<T>(value);

  const timeoutId = useRef<any>();

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const onFlush = useCallback(() => {
    if (internalValue.length === 0) {
      setInternalValue(value);
    } else if (value !== internalValue) {
      onChange(internalValue);
      setInternalValue(internalValue);
    }

    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }
  }, [internalValue, onChange, value]);

  const onFlustRef = useStateRef(onFlush);

  const onEnter = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      switch (event.key.toLowerCase()) {
        case 'enter':
          onFlush();
          break;
        case 'escape':
          setInternalValue(value);
          break;
      }
    },
    [onFlush, value],
  );

  const inputOnChange = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      setInternalValue(target.value as T);

      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
        timeoutId.current = null;
      }

      if (target.value.length > 0) {
        timeoutId.current = setTimeout(() => {
          onFlustRef.current?.();
        }, 1000);
      }
    },
    [onFlustRef],
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
      value={internalValue}
      pattern={pattern}
      onBlur={onFlush}
      onKeyDown={onEnter}
    />
  );
}
