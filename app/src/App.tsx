import { useIsDesktopChrome } from '@terra-dev/is-desktop-chrome';
import { AppProviders2 } from 'base/AppProviders2';
import { GlobalStyle } from 'components/GlobalStyle';
import { Header } from 'components/Header';
import { MessageBox } from 'components/MessageBox';
import { Airdrop } from 'pages/airdrop';
import { BAsset } from 'pages/basset';
import { Borrow } from 'pages/borrow';
import { Earn } from 'pages/earn';
import { Governance } from 'pages/gov';
import { govPathname } from 'pages/gov/env';
import { Redirect, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

export function App() {
  const isDesktopChrome = useIsDesktopChrome();

  return (
    <AppProviders2>
      <div>
        <GlobalStyle />
        <Header />
        <EmptyCatcher>
          {!isDesktopChrome && (
            <MessageBox
              level="info"
              hide={{ id: 'chrome-only', period: 1000 * 60 * 60 * 24 * 7 }}
            >
              Anchor currently only supports{' '}
              <a href="https://www.google.com/chrome/">desktop Chrome</a>
            </MessageBox>
          )}
        </EmptyCatcher>
        <Switch>
          <Route path="/earn" component={Earn} />
          <Route path="/borrow" component={Borrow} />
          <Route path="/bond" component={BAsset} />
          <Route path="/airdrop" component={Airdrop} />
          <Route path={`/${govPathname}`} component={Governance} />
          <Redirect to="/earn" />
        </Switch>
      </div>
    </AppProviders2>
  );
}

const EmptyCatcher = styled.div`
  :not(:empty) {
    padding: 20px 30px 10px 30px;

    display: flex;
    flex-direction: column;

    > * {
      margin: 0;

      &:not(:first-child) {
        margin-top: 10px;
      }
    }
  }

  :empty {
    display: block;
    height: 50px;
  }
`;
