import React from 'react';
import { DeploymentSwitch } from '../../../layouts/DeploymentSwitch';
import { TerraWalletSelector } from './TerraWalletSelector';
import { EvmWalletSelector } from './EvmWalletSelector';

export function WalletSelector() {
  return (
    <DeploymentSwitch
      terra={TerraWalletSelector}
      ethereum={EvmWalletSelector}
    />
  );
}
