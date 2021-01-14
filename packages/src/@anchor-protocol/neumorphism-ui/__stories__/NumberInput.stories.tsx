import { NumberInput } from '@anchor-protocol/neumorphism-ui/components/NumberInput';
import styled from 'styled-components';

export default {
  title: 'components/NumberInput',
};

export const Basic = () => {
  return (
    <Layout>
      <NumberInput />
      <NumberInput disabled />
      <NumberInput maxDecimalPoints={6} />
      <NumberInput maxDecimalPoints={6} disabled />
      <NumberInput type="integer" />
      <NumberInput type="integer" disabled />
    </Layout>
  );
};

const Layout = styled.div`
  width: 300px;
  display: grid;
  grid-template-columns: repeat(2, 300px);
  grid-gap: 20px;
`;
