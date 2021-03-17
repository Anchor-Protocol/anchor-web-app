import { HorizontalRuler } from '@terra-dev/neumorphism-ui/components/HorizontalRuler';
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
