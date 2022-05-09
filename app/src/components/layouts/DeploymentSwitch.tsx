import { useDeploymentTarget } from '@anchor-protocol/app-provider';
import { Chain } from '@anchor-protocol/types';
import React, { FunctionComponent, ReactNode } from 'react';

interface DeploymentSwitchProps {
  terra: FunctionComponent | ReactNode;
  ethereum: FunctionComponent | ReactNode;
  avalanche?: FunctionComponent | ReactNode;
  bsc?: FunctionComponent | ReactNode;
  aurora?: FunctionComponent | ReactNode;
}

export function DeploymentSwitch(props: DeploymentSwitchProps) {
  const { terra, ethereum, avalanche, bsc, aurora } = props;
  const {
    target: { chain },
  } = useDeploymentTarget();
  let content: ReactNode;

  switch (chain) {
    case Chain.Terra:
      content = terra;
      break;
    case Chain.Ethereum:
      content = ethereum;
      break;
    case Chain.Avalanche:
      content = avalanche ?? ethereum;
      break;
    case Chain.BSC:
      content = bsc;
      break;
    case Chain.Aurora:
      content = aurora;
      break;
    default:
      content = <></>;
  }

  return typeof content === 'function' ? content() : content;
}
