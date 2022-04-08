import React from 'react';
import { useDeploymentTarget } from '@anchor-protocol/app-provider';
import { useEvmBlockNumberQuery } from 'queries';
import { BlockInfo } from './BlockInfo';

export const EvmBlockInfo = () => {
  const {
    target: { chain },
  } = useDeploymentTarget();

  const { data: evmBlockNumber } = useEvmBlockNumberQuery();

  if (evmBlockNumber === undefined) {
    return null;
  }

  return <BlockInfo blockNumber={evmBlockNumber} chainName={chain} />;
};
