import { UIElementProps } from '@libs/ui';
import { PaddedLayout } from 'components/layouts/PaddedLayout';
import { PageTitle, TitleContainer } from 'components/primitives/PageTitle';
import { links } from 'env';
import React from 'react';
import styled from 'styled-components';
import { CollateralList } from './components/CollateralList';
import { Overview } from './components/Overview';

function GaugesMainBase(props: UIElementProps) {
  const { className } = props;
  return (
    <PaddedLayout className={className}>
      <TitleContainer>
        <PageTitle title="GAUGES" docs={links.docs.gauges} />
      </TitleContainer>
      <Overview className="overview" />
      <CollateralList />
    </PaddedLayout>
  );
}

export const GaugesMain = styled(GaugesMainBase)`
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
