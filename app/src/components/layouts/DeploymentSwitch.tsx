import { Chain, useDeploymentTarget } from '@anchor-protocol/app-provider';
import React, { ReactNode } from 'react';

type RenderFn = () => ReactNode;

interface DeploymentSwitchProps {
  terra?: RenderFn;
  ethereum?: RenderFn;
}

const render = (fn?: RenderFn): ReactNode => {
  return fn && fn();
};

const DeploymentSwitch = (props: DeploymentSwitchProps) => {
  const { terra, ethereum } = props;

  const { chain } = useDeploymentTarget();

  return (
    <>
      {chain === Chain.Terra ? (
        render(terra)
      ) : chain === Chain.Ethereum ? (
        render(ethereum)
      ) : (
        <></>
      )}
    </>
  );
};

export { DeploymentSwitch };
