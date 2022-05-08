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

export interface WithdrawAncTxParams {
  amount: string;
}

export function useWithdrawAncTx():
  | BackgroundTxResult<WithdrawAncTxParams>
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
      txParams: WithdrawAncTxParams,
      handleEvent: CrossChainEventHandler<ContractReceipt>,
    ) => {
      const withdrawAmount = microfy(formatInput(txParams.amount)).toString();

      const writer = new EvmTxProgressWriter(
        renderTxResultsRef.current!,
        connectionType,
      );

      try {
        writer.withdrawAnc();
        writer.timer.reset();

        const response = await xAnchor.anc.withdraw(address!, withdrawAmount, {
          handleEvent: (event) => {
            handleEvent(event);
            writer.withdrawAnc(event);
          },
        });

        return response;
      } finally {
        writer.timer.stop();
      }
    },
    [address, connectionType, xAnchor, microfy, formatInput],
  );

  const displayTx = useCallback(
    (txParams: WithdrawAncTxParams) => ({
      txKind: TxKind.WithdrawAnc,
      amount: `${formatOutput(txParams.amount as ANC)} ${ANC_SYMBOL}`,
      timestamp: Date.now(),
    }),
    [formatOutput],
  );

  const backgroundTxResult = useBackgroundTx<WithdrawAncTxParams>(
    depositTx,
    displayTx,
  );

  renderTxResultsRef.current = backgroundTxResult?.renderTxResults;

  return address ? backgroundTxResult : undefined;
}
