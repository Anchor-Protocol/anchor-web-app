import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';

export default {
  title: 'components/Section',
};

export const Basic = () => (
  <Section style={{ maxWidth: 600, margin: '2rem auto' }}>
    <h1>Title</h1>
  </Section>
);
