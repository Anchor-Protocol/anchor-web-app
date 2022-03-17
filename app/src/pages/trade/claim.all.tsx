import React from 'react';
import { DeploymentSwitch } from 'components/layouts/DeploymentSwitch';
import { TerraClaimAll } from './components/terra/TerraClaimAll';
import { EvmClaimAll } from './components/evm/EvmClaimAll';

export const ClaimAll = () => {
  return (
    <DeploymentSwitch terra={<TerraClaimAll />} ethereum={<EvmClaimAll />} />
  );
};
