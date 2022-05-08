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
    <VStack gap={40}>
      <PrimaryContent>
        <AncTokenOverview />
        <MyAncTokenOverview />
      </PrimaryContent>
      <SecondaryContent>
        <AncTrade />
        <AncUstLp />
      </SecondaryContent>
    </VStack>
  );
}

const PrimaryContent = styled.div`
  display: grid;
  grid-template-columns: 5fr 9fr;
  gap: 40px;

  @media (max-width: ${screen.pc.max}px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: ${screen.tablet.max}px) {
    grid-template-columns: 1fr;
  }
`;

const SecondaryContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  width: 100%;

  @media (max-width: ${screen.tablet.max}px) {
    grid-template-columns: 1fr;
  }
`;
