import React from 'react';
import { DeploymentSwitch } from 'components/layouts/DeploymentSwitch';
import { TerraApp } from './TerraApp';
import { EvmApp } from './EvmApp';

export function App() {
  return <DeploymentSwitch terra={TerraApp} ethereum={EvmApp} />;
}
