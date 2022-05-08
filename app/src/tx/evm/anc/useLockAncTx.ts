import { useEvmSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import { Subject } from 'rxjs';
import { useCallback, useRef } from 'react';
import { ContractReceipt } from 'ethers';
import { CrossChainEventHandler } from '@anchor-protocol/crossanchor-sdk';
import { useFormatters } from '@anchor-protocol/formatter/useFormatters';
import { EvmTxProgressWriter } from '../EvmTxProgressWriter';
import { TxKind } from '../utils';
import { useBackgroundTx, BackgroundTxResult } from '../useBackgroundTx';
import { ANC_SYMBOL } from '@anchor-protocol/token-symbols';
import { ANC } from '@anchor-protocol/types';

export interface LockAncTxParams {
  amount: string;
  period?: number;
}

export function useLockAncTx():
  | BackgroundTxResult<LockAncTxParams>
  | undefined {
  const { address, connectionType } = useEvmWallet();
  const xAnchor = useEvmSdk();
  const {
    anc: { microfy, formatInput, formatOutput },
  } = useFormatters();
  const renderTxResultsRef =
    useRef<Subject<TxResultRendering<ContractReceipt | null>>>();

  const depositTx = useCallback(
    async (
      txParams: LockAncTxParams,
      handleEvent: CrossChainEventHandler<ContractReceipt>,
    ) => {
      const lockAmount = microfy(formatInput(txParams.amount)).toString();

      const writer = new EvmTxProgressWriter(
        renderTxResultsRef.current!,
        connectionType,
      );
      writer.approveCollateral(ANC_SYMBOL);
      writer.timer.start();

      try {
        await xAnchor.approveLimit(
          address!,
          { contract: xAnchor.config.token.ANC },
          lockAmount,
        );

        writer.lockAnc();
        writer.timer.reset();

        const response = await xAnchor.anc.lock(
          address!,
          lockAmount,
          txParams.period ?? 0,
          {
            handleEvent: (event) => {
              handleEvent(event);
              writer.lockAnc(event);
            },
          },
        );

        return response;
      } finally {
        writer.timer.stop();
      }
    },
    [address, connectionType, xAnchor, microfy, formatInput],
  );

  const displayTx = useCallback(
    (txParams: LockAncTxParams) => ({
      txKind: TxKind.LockAnc,
      amount: `${formatOutput(txParams.amount as ANC)} ${ANC_SYMBOL}`,
      timestamp: Date.now(),
    }),
    [formatOutput],
  );

  const backgroundTxResult = useBackgroundTx<LockAncTxParams>(
    depositTx,
    displayTx,
  );

  renderTxResultsRef.current = backgroundTxResult?.renderTxResults;

  return address ? backgroundTxResult : undefined;
}
