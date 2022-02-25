import React from 'react';
import { DeploymentSwitch } from 'components/layouts/DeploymentSwitch';
import { TerraApp } from 'apps/TerraApp';
import { EvmApp } from 'apps/EvmApp';
import { DeploymentTargetProvider } from '@anchor-protocol/app-provider/contexts/target';

export function App() {
  return (
    <DeploymentTargetProvider>
      <DeploymentSwitch terra={TerraApp} ethereum={EvmApp} />
    </DeploymentTargetProvider>
  );
}
