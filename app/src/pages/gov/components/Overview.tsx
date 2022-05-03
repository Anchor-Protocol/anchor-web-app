import { screen } from 'env';
import React from 'react';
import styled from 'styled-components';
import { AncTrade } from './AncTrade';
import { AncUstLp } from './AncUstLp';
import { AncTokenOverview } from './AncTokenOverview';
import { MyAncTokenOverview } from './MyAncTokenOverview';
import { VStack } from '@libs/ui/Stack';

export function Overview() {
  return (
    <Container gap={40}>
      <PrimaryContent>
        <AncTokenOverview />
        <MyAncTokenOverview />
      </PrimaryContent>
      <SecondaryContent>
        <AncTrade />
        <AncUstLp />
      </SecondaryContent>
    </Container>
  );
}

// TODO: move responsive styles to the card itself
const Container = styled(VStack)`
  // tablet
  @media (min-width: ${screen.tablet.min}px) and (max-width: ${screen.tablet
      .max}px) {
    .NeuSection-root {
      .NeuSection-content {
        padding: 30px;
      }
    }
  }

  // mobile
  @media (max-width: ${screen.mobile.max}px) {
    .NeuSection-root {
      margin-bottom: 20px;

      .NeuSection-content {
        padding: 20px;
      }
    }
  }
`;

const PrimaryContent = styled.div`
  display: grid;
  grid-template-columns: 5fr 9fr;
  gap: 40px;

  @media (max-width: ${screen.pc.max}px) {
    grid-template-columns: 6fr 8fr;
  }

  @media (max-width: ${screen.tablet.max}px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: ${screen.mobile.max}px) {
    grid-template-columns: 1fr;
  }
`;

const SecondaryContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;

  @media (max-width: ${screen.tablet.max}px) {
    grid-template-columns: 1fr;
  }
`;
