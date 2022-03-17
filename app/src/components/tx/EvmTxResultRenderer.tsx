import { CrossChainTxResponse } from '@anchor-protocol/crossanchor-sdk';
import { TxResultRendering } from '@libs/app-fns';
import { StreamResult, StreamStatus } from '@rx-stream/react';
import { ContractReceipt } from 'ethers';
import React from 'react';
import { TxResultRenderer } from './TxResultRenderer';

type Tx = CrossChainTxResponse<ContractReceipt> | null;

type EvmTxResultRendererProps = {
  txStreamResult: StreamResult<TxResultRendering<Tx>> | null;
  onExit: () => void;
  onMinimize?: () => void;
  minimizable?: boolean;
};

export function EvmTxResultRenderer({
  onExit,
  txStreamResult,
  onMinimize,
  minimizable,
}: EvmTxResultRendererProps) {
  if (
    !txStreamResult ||
    !(
      txStreamResult.status === StreamStatus.IN_PROGRESS ||
      txStreamResult.status === StreamStatus.DONE
    )
  ) {
    return null;
  }

  return (
    <TxResultRenderer
      onExit={onExit}
      resultRendering={txStreamResult.value}
      onMinimize={onMinimize}
      minimizable={minimizable}
    />
  );
}
