import { HorizontalRuler } from '@libs/neumorphism-ui/components/HorizontalRuler';
import React from 'react';
import styled from 'styled-components';

export default {
  title: 'components/HorizontalRuler',
};

export const Basic = () => {
  return (
    <Layout>
      <HorizontalRuler />
      <HorizontalRuler style={{ borderStyle: 'dashed' }} />
      <HorizontalRuler style={{ borderStyle: 'dotted' }} />
    </Layout>
  );
};

const Layout = styled.div`
  hr {
    margin: 30px 0;
  }
`;
