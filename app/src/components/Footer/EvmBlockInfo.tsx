import React from 'react';
import { useDeploymentTarget } from '@anchor-protocol/app-provider';
import { useEvmBlockNumber } from '@anchor-protocol/app-provider/queries/evm/evmBlockNumber';
import { BlockInfo } from './BlockInfo';

export const EvmBlockInfo = () => {
  const {
    target: { chain },
  } = useDeploymentTarget();

  const evmBlockNumber = useEvmBlockNumber();

  if (!evmBlockNumber) return null;

  return <BlockInfo blockNumber={evmBlockNumber} chainName={chain} />;
};
