import React from 'react';
import { DeploymentSwitch } from 'components/layouts/DeploymentSwitch';
import { TerraApp } from 'apps/TerraApp';
import { EvmApp } from 'apps/EvmApp';

export function App() {
  return <DeploymentSwitch terra={TerraApp} ethereum={EvmApp} />;
}
