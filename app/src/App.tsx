import React from 'react';
import { DeploymentSwitch } from 'components/layouts/DeploymentSwitch';
import { TerraApp } from 'TerraApp';

export function App() {
  return <DeploymentSwitch terra={TerraApp} />;
}
