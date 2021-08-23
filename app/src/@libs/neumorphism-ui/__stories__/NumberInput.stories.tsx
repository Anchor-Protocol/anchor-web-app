import { NumberInput } from '@libs/neumorphism-ui/components/NumberInput';
import React from 'react';
import styled from 'styled-components';

export default {
  title: 'components/NumberInput',
};

export const Basic = () => {
  return (
    <Layout>
      <NumberInput label="NO OPTIONS" />
      <NumberInput label="NO OPTIONS" disabled />
      <NumberInput label="MAX INTEGER = 6" maxIntegerPoinsts={6} />
      <NumberInput label="MAX INTEGER = 6" maxIntegerPoinsts={6} disabled />
      <NumberInput label="MAX DECIMAL = 6" maxDecimalPoints={6} />
      <NumberInput label="MAX DECIMAL = 6" maxDecimalPoints={6} disabled />
      <NumberInput
        label="MAX INTEGER = 6, DECIMAL = 6"
        maxIntegerPoinsts={6}
        maxDecimalPoints={6}
      />
      <NumberInput
        label="MAX INTEGER = 6, DECIMAL = 6"
        maxIntegerPoinsts={6}
        maxDecimalPoints={6}
        disabled
      />
      <NumberInput label="ONLY INTEGER" type="integer" />
      <NumberInput label="ONLY INTEGER" type="integer" disabled />
    </Layout>
  );
};

const Layout = styled.div`
  width: 300px;
  display: grid;
  grid-template-columns: repeat(2, 300px);
  grid-gap: 20px;
`;
