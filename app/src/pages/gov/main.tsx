import { PaddedLayout } from 'components/layouts/PaddedLayout';
import { PageTitle, TitleContainer } from 'components/primitives/PageTitle';
import { links } from 'env';
import React from 'react';
import styled from 'styled-components';
import { Overview } from './components/Overview';
import { Polls } from './components/Polls';

export interface GovernanceMainProps {
  className?: string;
}

function GovernanceMainBase({ className }: GovernanceMainProps) {
  return (
    <PaddedLayout className={className}>
      <TitleContainer>
        <PageTitle title="GOVERNANCE" docs={links.docs.gov} />
      </TitleContainer>
      <Overview className="overview" />
      <Polls className="polls" />
    </PaddedLayout>
  );
}

export const GovernanceMain = styled(GovernanceMainBase)`
  // ---------------------------------------------
  // style
  // ---------------------------------------------
  header {
    display: flex;
    align-items: center;

    margin: 80px 0 30px 0;

    div:empty {
      flex: 1;
    }

    h2 {
      font-size: 18px;
      font-weight: 700;
    }

    select {
      height: 40px;
    }

    button,
    a {
      width: 180px;
      height: 48px;
      border-radius: 26px;
      margin-left: 10px;
    }
  }
`;
