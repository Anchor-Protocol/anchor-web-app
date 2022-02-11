import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { DesktopHeader } from './DesktopHeader';
import { MobileHeader } from './MobileHeader';

export function Header() {
  const isMobile = useMediaQuery({ maxWidth: 900 });

  return isMobile ? <MobileHeader /> : <DesktopHeader />;
}
