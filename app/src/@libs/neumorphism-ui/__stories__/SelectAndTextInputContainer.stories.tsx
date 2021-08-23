import { SelectAndTextInputContainer } from '@libs/neumorphism-ui/components/SelectAndTextInputContainer';
import { Input, NativeSelect as MuiNativeSelect } from '@material-ui/core';
import React, { useState } from 'react';

export default {
  title: 'components/SelectAndTextInputContainer',
};

interface Item {
  label: string;
  value: string;
}

const items: Item[] = Array.from(
  { length: Math.floor(Math.random() * 30) },
  (_, i) => ({
    label: 'Item ' + i,
    value: 'item' + i,
  }),
);

export const Basic = () => {
  const [selectedItem, setSelectedItem] = useState<Item>(() => items[0]);

  return (
    <SelectAndTextInputContainer gridColumns={[120, '1fr']}>
      <MuiNativeSelect
        value={selectedItem.value}
        onChange={({ target }) =>
          setSelectedItem(
            items.find(({ value }) => target.value === value) ?? items[0],
          )
        }
      >
        {items.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </MuiNativeSelect>
      <Input placeholder="PLACEHOLDER" />
    </SelectAndTextInputContainer>
  );
};

export const HelperText = () => {
  const [selectedItem, setSelectedItem] = useState<Item>(() => items[0]);

  return (
    <SelectAndTextInputContainer
      gridColumns={[120, '1fr']}
      leftHelperText="LEFT"
      rightHelperText="RIGHT"
    >
      <MuiNativeSelect
        value={selectedItem.value}
        onChange={({ target }) =>
          setSelectedItem(
            items.find(({ value }) => target.value === value) ?? items[0],
          )
        }
      >
        {items.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </MuiNativeSelect>
      <Input placeholder="PLACEHOLDER" />
    </SelectAndTextInputContainer>
  );
};

export const Readonly = () => {
  const [selectedItem, setSelectedItem] = useState<Item>(() => items[0]);

  return (
    <SelectAndTextInputContainer gridColumns={[120, '1fr']} aria-readonly>
      <MuiNativeSelect
        value={selectedItem.value}
        onChange={({ target }) =>
          setSelectedItem(
            items.find(({ value }) => target.value === value) ?? items[0],
          )
        }
      >
        {items.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </MuiNativeSelect>
      <Input placeholder="PLACEHOLDER" />
    </SelectAndTextInputContainer>
  );
};

export const Disabled = () => {
  const [selectedItem, setSelectedItem] = useState<Item>(() => items[0]);

  return (
    <SelectAndTextInputContainer gridColumns={[120, '1fr']} aria-disabled>
      <MuiNativeSelect
        value={selectedItem.value}
        onChange={({ target }) =>
          setSelectedItem(
            items.find(({ value }) => target.value === value) ?? items[0],
          )
        }
      >
        {items.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </MuiNativeSelect>
      <Input placeholder="PLACEHOLDER" />
    </SelectAndTextInputContainer>
  );
};

export const Multiline = () => {
  const [selectedItem, setSelectedItem] = useState<Item>(() => items[0]);

  return (
    <SelectAndTextInputContainer
      gridColumns={[120, '1fr', '1fr']}
      gridRows={[60, 60, 60, 60]}
    >
      <MuiNativeSelect
        value={selectedItem.value}
        onChange={({ target }) =>
          setSelectedItem(
            items.find(({ value }) => target.value === value) ?? items[0],
          )
        }
      >
        {items.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </MuiNativeSelect>
      <Input placeholder="PLACEHOLDER" />
      <Input placeholder="PLACEHOLDER" />

      <MuiNativeSelect
        value={selectedItem.value}
        onChange={({ target }) =>
          setSelectedItem(
            items.find(({ value }) => target.value === value) ?? items[0],
          )
        }
      >
        {items.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </MuiNativeSelect>
      <Input placeholder="PLACEHOLDER" />
      <Input placeholder="PLACEHOLDER" />

      <MuiNativeSelect
        value={selectedItem.value}
        onChange={({ target }) =>
          setSelectedItem(
            items.find(({ value }) => target.value === value) ?? items[0],
          )
        }
      >
        {items.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </MuiNativeSelect>
      <Input placeholder="PLACEHOLDER" />
      <Input placeholder="PLACEHOLDER" />

      <MuiNativeSelect
        value={selectedItem.value}
        onChange={({ target }) =>
          setSelectedItem(
            items.find(({ value }) => target.value === value) ?? items[0],
          )
        }
      >
        {items.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </MuiNativeSelect>
      <Input placeholder="PLACEHOLDER" />
      <Input placeholder="PLACEHOLDER" />
    </SelectAndTextInputContainer>
  );
};
