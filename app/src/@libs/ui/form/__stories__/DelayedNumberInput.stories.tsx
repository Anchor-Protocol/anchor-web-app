import { DelayedNumberInput } from '@libs/ui';
import { Meta } from '@storybook/react';
import React, { useState } from 'react';

export default {
  title: 'components/DelayedNumberInput',
} as Meta;

export const Basic = () => {
  const [value, setValue] = useState<string>('');
  return (
    <div>
      <DelayedNumberInput
        value={value}
        onChange={setValue}
        style={{ border: '1px solid black' }}
      />

      <p>{value}</p>
    </div>
  );
};
