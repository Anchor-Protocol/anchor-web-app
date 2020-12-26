import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { TextButton } from '@anchor-protocol/neumorphism-ui/components/TextButton';
import { CircularProgress } from '@material-ui/core';
import { Send } from '@material-ui/icons';
import styled from 'styled-components';

export default {
  title: 'components/Button',
};

export const Basic = () => (
  <Layout>
    <TextButton>BUTTON</TextButton>
    <ActionButton>BUTTON</ActionButton>
    <TextButton disabled>BUTTON</TextButton>
    <ActionButton disabled>BUTTON</ActionButton>
  </Layout>
);

export const WithIcon = () => (
  <Layout>
    <TextButton>
      <Send style={{ marginRight: 10 }} />
      BUTTON
    </TextButton>
    <ActionButton>
      <CircularProgress
        size="1.5rem"
        style={{ color: 'currentColor', marginRight: 10 }}
      />
      BUTTON
    </ActionButton>
    <TextButton disabled>
      <Send style={{ marginRight: 10 }} />
      BUTTON
    </TextButton>
    <ActionButton disabled>
      <CircularProgress
        size="1.5rem"
        style={{ color: 'currentColor', marginRight: 10 }}
      />
      BUTTON
    </ActionButton>
  </Layout>
);

const Layout = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 200px);
  grid-gap: 20px;
`;
