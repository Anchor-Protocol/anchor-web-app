import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { InfoTooltip } from '@libs/neumorphism-ui/components/InfoTooltip';
import { UIElementProps } from '@libs/ui';
import { SubHeader } from 'pages/gov/components/SubHeader';
import React from 'react';
import styled from 'styled-components';
import { CollateralList } from './components/CollateralList';
import { Overview } from './components/Overview';

function GaugesBase(props: UIElementProps) {
  const { className } = props;
  return (
    <section className={className}>
      <SubHeader breakPoints={900}>
        <h2>
          <IconSpan>
            Gauges{' '}
            <InfoTooltip>
              Gauge weighting can be voted on per collateral
            </InfoTooltip>
          </IconSpan>
        </h2>
      </SubHeader>
      <Overview className="overview" />
      <CollateralList />
    </section>
  );
}

export const Gauges = styled(GaugesBase)`
  header {
    display: flex;
    align-items: center;

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
