import { useEvmSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import { Subject } from 'rxjs';
import { useCallback, useRef } from 'react';
import { ContractReceipt } from 'ethers';
import { CrossChainEventHandler } from '@anchor-protocol/crossanchor-sdk';
import { EvmTxProgressWriter } from '../EvmTxProgressWriter';
import { TxKind } from '../utils';
import { useBackgroundTx, BackgroundTxResult } from '../useBackgroundTx';

export interface ExtendAncLockPeriodTxParams {
  period: number;
}

export function useExtendAncLockPeriodTx():
  | BackgroundTxResult<ExtendAncLockPeriodTxParams>
  | undefined {
  const { address, connectionType } = useEvmWallet();
  const xAnchor = useEvmSdk();
  const renderTxResultsRef =
    useRef<Subject<TxResultRendering<ContractReceipt | null>>>();

  const depositTx = useCallback(
    async (
      txParams: ExtendAncLockPeriodTxParams,
      handleEvent: CrossChainEventHandler<ContractReceipt>,
    ) => {
      const writer = new EvmTxProgressWriter(
        renderTxResultsRef.current!,
        connectionType,
      );
      writer.timer.start();

      try {
        const response = await xAnchor.anc.extendLockPeriod(
          address!,
          txParams.period,
          {
            handleEvent: (event) => {
              handleEvent(event);
              writer.extendAncLockPeriod(event);
            },
          },
        );

        return response;
      } finally {
        writer.timer.stop();
      }
    },
    [address, connectionType, xAnchor],
  );

  const displayTx = useCallback(
    (txParams: ExtendAncLockPeriodTxParams) => ({
      txKind: TxKind.ExtendAncLockPeriod,
      timestamp: Date.now(),
    }),
    [],
  );

  const backgroundTxResult = useBackgroundTx<ExtendAncLockPeriodTxParams>(
    depositTx,
    displayTx,
  );

  renderTxResultsRef.current = backgroundTxResult?.renderTxResults;

  return address ? backgroundTxResult : undefined;
}
