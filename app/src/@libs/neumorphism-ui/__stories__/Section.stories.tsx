import { Section } from '@libs/neumorphism-ui/components/Section';
import React from 'react';

export default {
  title: 'components/Section',
};

export const Basic = () => (
  <Section style={{ maxWidth: 600, margin: '2rem auto' }}>
    <h1>Title</h1>
  </Section>
);
