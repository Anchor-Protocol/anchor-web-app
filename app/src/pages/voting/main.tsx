import { UIElementProps } from '@libs/ui';
import { PaddedLayout } from 'components/layouts/PaddedLayout';
import { PageTitle, TitleContainer } from 'components/primitives/PageTitle';
import { links } from 'env';
import React from 'react';
import styled from 'styled-components';
import { Gauges } from './components/Gauges';
import { Overview } from './components/Overview';

function VotingMainBase(props: UIElementProps) {
  const { className } = props;
  return (
    <PaddedLayout className={className}>
      <TitleContainer>
        <PageTitle title="VOTING" docs={links.docs.voting} />
      </TitleContainer>
      <Overview className="overview" />
      <Gauges className="gauges" />
    </PaddedLayout>
  );
}

export const VotingMain = styled(VotingMainBase)`
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
