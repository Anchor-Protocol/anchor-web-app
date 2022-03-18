import React from 'react';
import { UIElementProps } from '@libs/ui';
import { createContext, useContext } from 'react';
import { useMemo, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';

export enum Chain {
  Terra = 'Terra',
  Ethereum = 'Ethereum',
  Avalanche = 'Avalanche',
}

export const DEPLOYMENT_TARGETS = [
  {
    chain: Chain.Terra,
    icon: '/assets/terra-network-logo.png',
    isNative: true,
    isEVM: false,
  },
  // {
  //   chain: Chain.Ethereum,
  //   icon: 'https://assets.terra.money/icon/wallet-provider/walletconnect.svg',
  //   isNative: false,
  //   isEVM: true,
  // },
  {
    chain: Chain.Avalanche,
    icon: '/assets/avalanche-avax-logo.svg',
    isNative: false,
    isEVM: true,
  },
];

export interface DeploymentTarget {
  chain: Chain;
  icon: string;
  isNative: boolean;
  isEVM: boolean;
}

interface UseDeploymentTargetReturn {
  target: DeploymentTarget;
  updateTarget: (target: DeploymentTarget) => void;
}

export const DeploymentTargetContext = createContext<
  UseDeploymentTargetReturn | undefined
>(undefined);

const useDeploymentTarget = (): UseDeploymentTargetReturn => {
  const context = useContext(DeploymentTargetContext);
  if (context === undefined) {
    throw new Error('The DeploymentTargetContext has not been defined.');
  }
  return context;
};

const DeploymentTargetProvider = (props: UIElementProps) => {
  const { children } = props;

  const [chain, setChain] = useLocalStorage<string>(
    '__anchor_deployment_target__',
    DEPLOYMENT_TARGETS[0].chain,
  );

  const [target, updateTarget] = useState(
    DEPLOYMENT_TARGETS.filter((target) => target.chain === chain)[0],
  );

  const value = useMemo(() => {
    return {
      target,
      updateTarget: (t: DeploymentTarget) => {
        updateTarget(t);
        setChain(t.chain);
      },
    };
  }, [target, updateTarget, setChain]);

  return (
    <DeploymentTargetContext.Provider value={value}>
      {children}
    </DeploymentTargetContext.Provider>
  );
};

export { DeploymentTargetProvider, useDeploymentTarget };
