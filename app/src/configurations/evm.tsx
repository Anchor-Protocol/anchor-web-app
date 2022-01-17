import React, { ReactNode } from 'react';
import { AppProviders } from './app';

export function EvmAppProviders({ children }: { children: ReactNode }) {
  return <AppProviders>{children}</AppProviders>;
}
