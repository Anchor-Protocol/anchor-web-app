import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { DesktopHeader } from './DesktopHeader';
import { TerraMobileHeader } from './TerraMobileHeader';
import { EvmMobileHeader } from './EvmMobileHeader';
import { DeploymentSwitch } from '../layouts/DeploymentSwitch';

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
