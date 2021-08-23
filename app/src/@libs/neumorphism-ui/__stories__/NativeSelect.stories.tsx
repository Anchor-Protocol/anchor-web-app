import { NativeSelect } from '@libs/neumorphism-ui/components/NativeSelect';
import React, { ChangeEvent, useState } from 'react';
import styled from 'styled-components';

export default {
  title: 'components/NativeSelect',
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

const createOptions = (data: Item[]) =>
  data.map(({ label, value }) => (
    <option key={value} value={value}>
      {label}
    </option>
  ));

export const Basic = () => {
  const [value, setValue] = useState<string | null>(null);

  return (
    <Layout>
      <NativeSelect
        value={value}
        onChange={({ target }: ChangeEvent<HTMLSelectElement>) =>
          setValue(target.value)
        }
      >
        {createOptions(items)}
      </NativeSelect>
      <NativeSelect
        value={value}
        onChange={({ target }: ChangeEvent<HTMLSelectElement>) =>
          setValue(target.value)
        }
        disabled
      >
        {createOptions(items)}
      </NativeSelect>
    </Layout>
  );
};

const Layout = styled.div`
  width: 300px;
  display: grid;
  grid-template-columns: repeat(2, 300px);
  grid-gap: 20px;
`;
