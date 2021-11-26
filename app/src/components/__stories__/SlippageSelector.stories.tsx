import { Meta } from '@storybook/react';
import { DiscloseSlippageSelector } from 'components/DiscloseSlippageSelector';
import {
  SlippageSelector,
  SlippageSelectorNegativeHelpText,
  SlippageSelectorPositiveHelpText,
} from 'components/SlippageSelector';
import React, { useState } from 'react';

export default {
  title: 'anchor/SlippageSelector',
} as Meta;

const items = [0.001, 0.005, 0.01];

export const Basic = () => {
  const [value, setValue] = useState<number>(0.01);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 60 }}>
      <SlippageSelector items={items} value={value} onChange={setValue} />

      <SlippageSelector
        items={items}
        value={value}
        onChange={setValue}
        helpText={
          <SlippageSelectorPositiveHelpText>
            Your transaction may be frontrun
          </SlippageSelectorPositiveHelpText>
        }
      />

      <SlippageSelector
        items={items}
        value={value}
        onChange={setValue}
        helpText={
          <SlippageSelectorNegativeHelpText>
            Enter a valid slippage percentage
          </SlippageSelectorNegativeHelpText>
        }
      />

      <DiscloseSlippageSelector
        items={items}
        value={value}
        onChange={setValue}
      />

      <p>value is "{value}"</p>
    </div>
  );
};
