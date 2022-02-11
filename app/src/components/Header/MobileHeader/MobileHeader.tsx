import React from 'react';
import { DeploymentSwitch } from '../../layouts/DeploymentSwitch';
import { TerraMobileHeader } from './TerraMobileHeader';
import { EvmMobileHeader } from './EvmMobileHeader';

export function MobileHeader() {
  return (
    <DeploymentSwitch terra={TerraMobileHeader} ethereum={EvmMobileHeader} />
  );
}
