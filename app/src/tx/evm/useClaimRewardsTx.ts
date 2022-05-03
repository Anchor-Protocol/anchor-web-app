import { useEvmSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import { TxKind } from './utils';
import { Subject } from 'rxjs';
import { useCallback, useRef } from 'react';
import { ContractReceipt } from 'ethers';
import { BackgroundTxResult, useBackgroundTx } from './useBackgroundTx';
import { CrossChainEventHandler } from '@anchor-protocol/crossanchor-sdk';
import { EvmTxProgressWriter } from './EvmTxProgressWriter';

export interface ClaimRewardsTxParams {}

export function useClaimRewardsTx():
  | BackgroundTxResult<ClaimRewardsTxParams>
  | undefined {
  const { address, connectionType } = useEvmWallet();
  const xAnchor = useEvmSdk();
  const renderTxResultsRef =
    useRef<Subject<TxResultRendering<ContractReceipt | null>>>();

  const claimRewards = useCallback(
    async (
      txParams: ClaimRewardsTxParams,
      handleEvent: CrossChainEventHandler<ContractReceipt>,
    ) => {
      const writer = new EvmTxProgressWriter(
        renderTxResultsRef.current!,
        connectionType,
      );
      writer.claimRewards();
      writer.timer.start();

      try {
        const result = await xAnchor.claimRewards(address!, {
          handleEvent: (event) => {
            writer.claimRewards(event);
            handleEvent(event);
          },
        });

        return result;
      } finally {
        writer.timer.stop();
      }
    },
    [address, connectionType, xAnchor],
  );

  const backgroundTxResult = useBackgroundTx<ClaimRewardsTxParams>(
    claimRewards,
    displayTx,
  );

  renderTxResultsRef.current = backgroundTxResult?.renderTxResults;

  return address ? backgroundTxResult : undefined;
}

const displayTx = () => ({
  txKind: TxKind.ClaimRewards,
  timestamp: Date.now(),
});
