export enum Chain {
  Terra = 'terra',
  Ethereum = 'ethereum',
}

export interface DeploymentOptions {
  chain: Chain;
  isNative: boolean;
  isEVM: boolean;
}

const useDeploymentTarget = (): DeploymentOptions => {
  // TODO: this probably needs to be updated from the env variables or from
  // a UI option that allows switching the chain
  // return {
  //   chain: Chain.Terra,
  //   isNative: true,
  //   isEVM: false,
  // };
  return {
    chain: Chain.Ethereum,
    isNative: false,
    isEVM: true,
  };
};

export { useDeploymentTarget };
