import React, {
  Consumer,
  Context,
  createContext,
  ReactNode,
  useContext,
  useMemo,
} from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { LiquidationAlert, useLiquidationAlert } from './liquidationAlert';

export interface JobsProviderProps {
  children: ReactNode;
}

export interface Jobs {
  liquidationAlert: LiquidationAlert;
  updateLiquidationAlert: (nextValue: LiquidationAlert) => void;
}

// @ts-ignore
const JobsContext: Context<Jobs> = createContext<Jobs>();

export function JobsProvider({ children }: JobsProviderProps) {
  const [liquidationAlert, updateLiquidationAlert] = useLocalStorage<{
    enabled: boolean;
    ratio: number;
  }>('__anchor_jobs_liquidation_alert__', {
    enabled: false,
    ratio: 0.5,
  });

  useLiquidationAlert(liquidationAlert);

  const state = useMemo<Jobs>(
    () => ({
      liquidationAlert,
      updateLiquidationAlert,
    }),
    [liquidationAlert, updateLiquidationAlert],
  );

  return <JobsContext.Provider value={state}>{children}</JobsContext.Provider>;
}

export function useJobs(): Jobs {
  return useContext(JobsContext);
}

export const JobsConsumer: Consumer<Jobs> = JobsContext.Consumer;
