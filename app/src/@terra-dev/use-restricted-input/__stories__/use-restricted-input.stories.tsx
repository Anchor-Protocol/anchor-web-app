import React, { useState } from 'react';
import { useRestrictedInput, useRestrictedNumberInput } from '../';

export default {
  title: 'core/use-restricted-input',
};

export const Basic = () => {
  const [value, setValue] = useState<string>('');

  const inputProps = useRestrictedInput((character) => /[a-c]/.test(character));

  return (
    <input
      type="text"
      {...inputProps}
      value={value}
      onChange={({ target }) => setValue(target.value)}
    />
  );
};

export const Integer = () => {
  const [value, setValue] = useState<string>('');

  const inputProps = useRestrictedNumberInput({
    type: 'integer',
    maxIntegerPoinsts: 4,
  });

  return (
    <input
      type="text"
      {...inputProps}
      value={value}
      onChange={({ target }) => setValue(target.value)}
    />
  );
};

export const Decimal = () => {
  const [value, setValue] = useState<string>('');

  const inputProps = useRestrictedNumberInput({
    type: 'decimal',
    maxIntegerPoinsts: 4,
    maxDecimalPoints: 3,
  });

  return (
    <input
      type="text"
      {...inputProps}
      value={value}
      onChange={({ target }) => setValue(target.value)}
    />
  );
};
