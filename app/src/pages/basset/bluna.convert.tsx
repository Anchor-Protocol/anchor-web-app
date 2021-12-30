import { Tab } from '@libs/neumorphism-ui/components/Tab';
import { fixHMR } from 'fix-hmr';
import { BLunaBurn } from 'pages/basset/components/BLunaBurn';
import { BLunaMint } from 'pages/basset/components/BLunaMint';
import React, { useCallback, useMemo } from 'react';
import {
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  useRouteMatch,
} from 'react-router-dom';
import styled from 'styled-components';

export interface BlunaConvertProps extends RouteComponentProps {
  className?: string;
}

interface Item {
  label: string;
  value: string;
  tooltip: string;
}

const tabItems: Item[] = [
  { label: 'MINT', value: 'mint', tooltip: 'Bond assets to mint bAssets' },
  {
    label: 'BURN',
    value: 'burn',
    tooltip: 'Burn previously minted bAssets to unbond your assets',
  },
];

function Component({ className, match, history }: BlunaConvertProps) {
  const pageMatch = useRouteMatch<{ page: string }>(`${match.path}/:page`);

  const tab = useMemo<Item | undefined>(() => {
    return tabItems.find(({ value }) => value === pageMatch?.params.page);
  }, [pageMatch?.params.page]);

  const tabChange = useCallback(
    (nextTab: Item) => {
      history.push({
        pathname: `${match.path}/${nextTab.value}`,
      });
    },
    [history, match.path],
  );

  return (
    <div className={className}>
      <Tab
        className="tab"
        items={tabItems}
        selectedItem={tab ?? tabItems[0]}
        onChange={tabChange}
        labelFunction={({ label }) => label}
        keyFunction={({ value }) => value}
        tooltipFunction={({ tooltip }) => tooltip}
      />

      <Switch>
        <Redirect exact path={`${match.path}/`} to={`${match.path}/mint`} />
        <Route path={`${match.path}/mint`} component={BLunaMint} />
        <Route path={`${match.path}/burn`} component={BLunaBurn} />
        <Redirect path={`${match.path}/*`} to={`${match.path}/mint`} />
      </Switch>
    </div>
  );
}

const StyledComponent = styled(Component)`
  // TODO
`;

export const BlunaConvert = fixHMR(StyledComponent);
