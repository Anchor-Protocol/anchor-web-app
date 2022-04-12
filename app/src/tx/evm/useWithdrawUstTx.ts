import { useEvmCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { TxKind, TX_GAS_LIMIT } from './utils';
import { Subject } from 'rxjs';
import { useCallback, useRef } from 'react';
import { BackgroundTxResult, useBackgroundTx } from './useBackgroundTx';
import { useFormatters } from '@anchor-protocol/formatter/useFormatters';
import { aUST } from '@anchor-protocol/types';
import { EvmTxProgressWriter } from './EvmTxProgressWriter';
import { CrossChainEventHandler } from '@anchor-protocol/crossanchor-sdk';
import { ContractReceipt } from 'ethers';
import { TxResultRendering } from '@libs/app-fns';

export interface WithdrawUstTxParams {
  withdrawAmount: string;
}

export function useWithdrawUstTx():
  | BackgroundTxResult<WithdrawUstTxParams>
  | undefined {
  const { address, connectionType } = useEvmWallet();
  const xAnchor = useEvmCrossAnchorSdk();
  const renderTxResultsRef =
    useRef<Subject<TxResultRendering<ContractReceipt | null>>>();

  const {
    aUST: { formatInput, microfy, formatOutput },
  } = useFormatters();

  const withdrawTx = useCallback(
    async (
      txParams: WithdrawUstTxParams,
      handleEvent: CrossChainEventHandler<ContractReceipt>,
    ) => {
      const withdrawAmount = microfy(
        formatInput(txParams.withdrawAmount),
      ).toString();

      const writer = new EvmTxProgressWriter(
        renderTxResultsRef.current!,
        connectionType,
      );
      writer.approveUST();
      writer.timer.start();

      try {
        await xAnchor.approveLimit(
          { token: 'aUST' },
          withdrawAmount,
          address!,
          TX_GAS_LIMIT,
        );

        writer.withdrawUST();
        writer.timer.reset();

        const result = await xAnchor.redeemStable(
          withdrawAmount,
          address!,
          TX_GAS_LIMIT,
          (event) => {
            writer.withdrawUST(event);
            handleEvent(event);
          },
        );

        return result;
      } finally {
        writer.timer.stop();
      }
    },
    [xAnchor, address, connectionType, formatInput, microfy],
  );

  const displayTx = useCallback(
    (txParams: WithdrawUstTxParams) => ({
      txKind: TxKind.WithdrawUst,
      amount: `${formatOutput(txParams.withdrawAmount as aUST)} aUST`,
      timestamp: Date.now(),
    }),
    [formatOutput],
  );

  const backgroundTxResult = useBackgroundTx<WithdrawUstTxParams>(
    withdrawTx,
    displayTx,
  );

  renderTxResultsRef.current = backgroundTxResult?.renderTxResults;

  return address ? backgroundTxResult : undefined;
}
