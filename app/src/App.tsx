import React from 'react';
import { DeploymentSwitch } from 'components/layouts/DeploymentSwitch';
import { TerraApp } from 'apps/TerraApp';
import { EvmApp } from 'apps/EvmApp';
import { DeploymentTargetProvider } from '@anchor-protocol/app-provider/contexts/target';
import { useChainOptions } from '@terra-money/wallet-provider';

export function App() {
  const chainOptions = useChainOptions();

  return (
    <DeploymentTargetProvider>
      <DeploymentSwitch
        terra={<TerraApp chainOptions={chainOptions} />}
        ethereum={<EvmApp />}
      />
    </DeploymentTargetProvider>
  );
}
