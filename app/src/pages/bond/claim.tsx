import { NativeSelect } from '@terra-dev/neumorphism-ui/components/NativeSelect';
import { Section } from '@terra-dev/neumorphism-ui/components/Section';
import React, { ChangeEvent, useState } from 'react';
import { ClaimEth } from './components/Claim/Eth';
import { ClaimLuna } from './components/Claim/Luna';

export interface ClaimProps {
  className?: string;
}

interface Item {
  label: string;
  value: string;
}

const assets: Item[] = [
  { label: 'bLUNA', value: 'bluna' },
  { label: 'bETH', value: 'beth' },
];

export function Claim({ className }: ClaimProps) {
  const [asset, setAsset] = useState<string>(() => assets[0].value);

  return (
    <Section className={className}>
      <NativeSelect
        fullWidth
        style={{ marginBottom: 60 }}
        value={asset}
        onChange={({ target }: ChangeEvent<HTMLSelectElement>) =>
          setAsset(target.value)
        }
      >
        {assets.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </NativeSelect>

      {asset === 'bluna' ? <ClaimLuna /> : <ClaimEth />}
    </Section>
  );
}
