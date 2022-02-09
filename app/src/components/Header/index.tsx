import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { DesktopHeader } from './DesktopHeader';
import { DeploymentSwitch } from '../layouts/DeploymentSwitch';
import { TerraMobileHeader } from './mobile/terra/TerraMobileHeader';
import { EvmMobileHeader } from './mobile/evm/EvmMobileHeader';

export function Header() {
  const isMobile = useMediaQuery({ maxWidth: 900 });

  return isMobile ? (
    <DeploymentSwitch
      terra={() => <TerraMobileHeader />}
      ethereum={() => <EvmMobileHeader />}
    />
  ) : (
    <DesktopHeader />
  );
}
