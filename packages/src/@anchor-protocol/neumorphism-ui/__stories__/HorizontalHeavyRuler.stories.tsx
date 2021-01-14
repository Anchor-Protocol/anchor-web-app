import { HorizontalHeavyRuler } from '@anchor-protocol/neumorphism-ui/components/HorizontalHeavyRuler';
import styled from 'styled-components';

export default {
  title: 'components/HorizontalHeavyRuler',
};

export const Basic = () => {
  return (
    <Layout>
      <HorizontalHeavyRuler/>
      <HorizontalHeavyRuler rulerWidth={8}/>
      <HorizontalHeavyRuler rulerWidth={10}/>
    </Layout>
  );
};

const Layout = styled.div`
  hr {
    margin: 30px 0;
  }
`;
