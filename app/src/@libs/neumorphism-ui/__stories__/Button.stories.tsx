import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { TextButton } from '@libs/neumorphism-ui/components/TextButton';
import { CircularProgress } from '@material-ui/core';
import { Send } from '@material-ui/icons';
import styled from 'styled-components';
import React from 'react';

export default {
  title: 'components/Button',
};

export const Basic = () => (
  <Layout>
    <TextButton>BUTTON</TextButton>
    <ActionButton>BUTTON</ActionButton>
    <BorderButton>BUTTON</BorderButton>
    <TextButton disabled>BUTTON</TextButton>
    <ActionButton disabled>BUTTON</ActionButton>
    <BorderButton disabled>BUTTON</BorderButton>
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
    <BorderButton>
      <Send style={{ marginRight: 10 }} />
      BUTTON
    </BorderButton>
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
    <BorderButton disabled>
      <Send style={{ marginRight: 10 }} />
      BUTTON
    </BorderButton>
  </Layout>
);

const Layout = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 200px);
  grid-gap: 20px;
`;
