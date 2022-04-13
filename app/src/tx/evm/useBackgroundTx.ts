import {
  CrossChainEventHandler,
  CrossChainTxResponse,
} from '@anchor-protocol/crossanchor-sdk';
import { ContractReceipt } from 'ethers';
import { useCallback, useMemo, useRef } from 'react';
import { createTx } from './createTx';
import { RenderedTxResult, useRenderedTx } from './useRenderedTx';
import { useBackgroundTxManager } from './useBackgroundTxManager';
import { TransactionDisplay } from './storage';
import { BackgroundTxActor } from './background';

export type BackgroundTxResult<TxParams> =
  | (RenderedTxResult<TxParams> & {
      minimize: () => void;
      minimizable: boolean;
    })
  | undefined;

export const useBackgroundTx = <TxParams>(
  sendTx: (
    txParams: TxParams,
    handleEvent: CrossChainEventHandler<ContractReceipt>,
  ) => Promise<CrossChainTxResponse<ContractReceipt>>,
  displayTx: (txParams: TxParams) => TransactionDisplay,
): BackgroundTxResult<TxParams> => {
  const backgroundTxManager = useBackgroundTxManager();
  const createTxResult = createTx(sendTx);
  const backgroundTxRef = useRef<BackgroundTxActor>();

  const sendTxCallback = useCallback(
    async (txParams: TxParams) => {
      const txRequest = createTxResult.tx(txParams);
      const display = displayTx(txParams);

      backgroundTxRef.current = backgroundTxManager!.trackNewTx({
        request: txRequest,
        events: createTxResult.txEvents,
        display,
        kind: display.txKind,
      });

      return txRequest;
    },
    [createTxResult, backgroundTxManager, displayTx],
  );

  const minimizable = backgroundTxRef.current?.minimizable() ?? false;

  const minimizeCallback = useCallback(() => {
    if (minimizable) {
      backgroundTxRef.current!.minimize();
    }
  }, [backgroundTxRef, minimizable]);

  const renderedTxResult = useRenderedTx(sendTxCallback);

  const backgroundTxResult = useMemo(
    () => ({
      ...renderedTxResult,
      minimize: minimizeCallback,
      minimizable,
    }),
    [minimizable, minimizeCallback, renderedTxResult],
  );

  return backgroundTxManager ? backgroundTxResult : undefined;
};
