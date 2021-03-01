import { AnchorNoCircle } from '@anchor-protocol/icons';
import { RulerTab } from '@anchor-protocol/neumorphism-ui/components/RulerTab';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { TokenIcon } from '@anchor-protocol/token-icons';
import { Circles } from 'components/Circles';
import { CenteredLayout } from 'components/layouts/CenteredLayout';
import { AncGovernanceClaim } from 'pages/gov/components/AncGovernanceClaim';
import { govPathname, ustBorrowPathname } from 'pages/gov/env';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

export interface RewardsUstBorrowProps {
  className?: string;
}

interface Item {
  label: string;
  value: string;
}

const claimItems: Item[] = [{ label: 'Claim', value: 'claim' }];

function RewardsUstBorrowBase({ className }: RewardsUstBorrowProps) {
  return (
    <CenteredLayout className={className}>
      <header>
        <h1>
          <Circles radius={24} backgroundColor="#ffffff">
            <TokenIcon
              token="ust"
              variant="@3x"
              style={{ fontSize: '1.1em' }}
            />
            <AnchorNoCircle style={{ fontSize: '1.4em' }} />
          </Circles>
          UST Borrow
        </h1>
      </header>

      <Section>
        <RulerTab
          className="subtab"
          items={claimItems}
          selectedItem={claimItems[0]}
          onChange={() => {}}
          labelFunction={({ label }) => label}
          keyFunction={({ value }) => value}
        />

        <Switch>
          <Route
            path={`/${govPathname}/rewards/${ustBorrowPathname}/claim`}
            component={AncGovernanceClaim}
          />
          <Redirect
            exact
            path={`/${govPathname}/rewards/${ustBorrowPathname}`}
            to={`/${govPathname}/rewards/${ustBorrowPathname}/claim`}
          />
          <Redirect
            path={`/${govPathname}/rewards/${ustBorrowPathname}/*`}
            to={`/${govPathname}/rewards/${ustBorrowPathname}/claim`}
          />
        </Switch>
      </Section>
    </CenteredLayout>
  );
}

export const RewardsUstBorrow = styled(RewardsUstBorrowBase)`
  header {
    display: grid;
    grid-template-columns: 1fr 250px;
    align-items: center;

    margin-bottom: 40px;

    h1 {
      font-size: 44px;
      font-weight: 900;
      display: flex;
      align-items: center;

      > :first-child {
        margin-right: 14px;
      }
    }
  }

  .subtab {
    margin-bottom: 70px;
  }
`;
