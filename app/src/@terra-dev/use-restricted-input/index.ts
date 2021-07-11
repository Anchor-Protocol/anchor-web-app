import {
  ChangeEvent,
  ClipboardEvent,
  KeyboardEvent,
  useCallback,
  useMemo,
} from 'react';

export interface RestrictedInputReturn {
  onKeyPress: (event: KeyboardEvent<HTMLInputElement>) => void;
  onPaste?: (event: ClipboardEvent<HTMLInputElement>) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

/**
 * @param availableCharacters 'abc', 'a-z', 'a-z0-9'
 */
export function useRestrictedInput(
  availableCharacters: ((character: string) => boolean) | string,
): RestrictedInputReturn {
  const test: (character: string) => boolean = useMemo(() => {
    if (typeof availableCharacters === 'string') {
      const pattern: RegExp = new RegExp(`[${availableCharacters}]`);
      return (character: string) => pattern.test(character);
    } else if (typeof availableCharacters === 'function') {
      return availableCharacters;
    }
    throw new Error('availableCharacters must be string or function');
  }, [availableCharacters]);

  const onKeyPress: (event: KeyboardEvent<HTMLInputElement>) => void =
    useCallback(
      (event: KeyboardEvent<HTMLInputElement>) => {
        if (!test(event.key)) {
          // prevent key press
          event.preventDefault();
          event.stopPropagation();
        }
      },
      [test],
    );

  return {
    onKeyPress,
  };
}

export interface RestrictedNumberInputParams {
  type?: 'decimal' | 'integer';
  maxDecimalPoints?: number;
  maxIntegerPoinsts?: number;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function useRestrictedNumberInput({
  type = 'decimal',
  maxDecimalPoints,
  maxIntegerPoinsts,
  onChange: _onChange,
}: RestrictedNumberInputParams): RestrictedInputReturn {
  const { onKeyPress: restrictCharacters } = useRestrictedInput(
    type === 'integer' ? '0-9' : '0-9.',
  );

  const isInvalid = useCallback(
    (nextValue: string): boolean => {
      return (
        Number.isNaN(+nextValue) ||
        (typeof maxIntegerPoinsts === 'number' &&
          new RegExp(`^[0-9]{${maxIntegerPoinsts + 1},}`).test(nextValue)) ||
        (type === 'decimal' &&
          typeof maxDecimalPoints === 'number' &&
          new RegExp(`\\.[0-9]{${maxDecimalPoints + 1},}$`).test(nextValue))
      );
    },
    [maxDecimalPoints, maxIntegerPoinsts, type],
  );

  const onKeyPress = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      restrictCharacters(event);

      if (event.isDefaultPrevented()) {
        return;
      }

      const { value, selectionStart, selectionEnd } =
        event.target as HTMLInputElement;

      if (
        typeof selectionStart !== 'number' ||
        typeof selectionEnd !== 'number'
      ) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      const char = event.key;

      const nextValue =
        value.substring(0, selectionStart) +
        char +
        value.substring(selectionEnd);

      if (isInvalid(nextValue)) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    [restrictCharacters, isInvalid],
  );

  const onPaste = useCallback(
    (event: ClipboardEvent<HTMLInputElement>) => {
      const pastedText = event.clipboardData?.getData('text');

      if (!/^[0-9.]+$/.test(pastedText)) {
        event.preventDefault();
        event.stopPropagation();
      }

      const { value, selectionStart, selectionEnd } =
        event.target as HTMLInputElement;

      if (
        typeof selectionStart !== 'number' ||
        typeof selectionEnd !== 'number'
      ) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      const nextValue =
        value.substring(0, selectionStart) +
        pastedText +
        value.substring(selectionEnd);

      if (isInvalid(nextValue)) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    [isInvalid],
  );

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (_onChange) {
        const hasNonNumeralCharacters = /[^0-9.]/g;

        if (hasNonNumeralCharacters.test(event.target.value)) {
          event.target.value = event.target.value.replace(/[^0-9.]/g, '');
        }

        _onChange(event);
      }
    },
    [_onChange],
  );

  return { onKeyPress, onPaste, onChange };
}
