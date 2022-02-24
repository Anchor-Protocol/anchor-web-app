export enum Chain {
  Terra = 'terra',
  Ethereum = 'ethereum',
  Avalanche = 'avalanche',
}

const DEPLOYMENT_OPTIONS = {
  [Chain.Terra]: {
    chain: Chain.Terra,
    isNative: true,
    isEVM: false,
  },
  [Chain.Ethereum]: {
    chain: Chain.Ethereum,
    isNative: false,
    isEVM: true,
  },
  [Chain.Avalanche]: {
    chain: Chain.Avalanche,
    isNative: false,
    isEVM: true,
  },
};

export interface DeploymentOptions {
  chain: Chain;
  isNative: boolean;
  isEVM: boolean;
}

const useDeploymentTarget = (): DeploymentOptions => {
  return DEPLOYMENT_OPTIONS[Chain.Ethereum];
};

export { useDeploymentTarget };
