import { useEvmCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import { TxKind } from './utils';
import { Subject } from 'rxjs';
import { useCallback, useRef } from 'react';
import { CrossChainEventHandler } from '@anchor-protocol/crossanchor-sdk';
import { ContractReceipt } from 'ethers';
import { BackgroundTxResult, useBackgroundTx } from './useBackgroundTx';
import { useFormatters } from '@anchor-protocol/formatter/useFormatters';
import { UST } from '@libs/types';
import { EvmTxProgressWriter } from './EvmTxProgressWriter';

export interface RepayUstTxParams {
  amount: string;
}

export function useRepayUstTx():
  | BackgroundTxResult<RepayUstTxParams>
  | undefined {
  const { address, connectionType } = useEvmWallet();
  const xAnchor = useEvmCrossAnchorSdk();
  const {
    ust: { microfy, formatInput, formatOutput },
  } = useFormatters();
  const renderTxResultsRef =
    useRef<Subject<TxResultRendering<ContractReceipt | null>>>();

  const repayTx = useCallback(
    async (
      txParams: RepayUstTxParams,
      handleEvent: CrossChainEventHandler<ContractReceipt>,
    ) => {
      const amount = microfy(formatInput(txParams.amount)).toString();

      const writer = new EvmTxProgressWriter(
        renderTxResultsRef.current!,
        connectionType,
      );
      writer.approveUST();
      writer.timer.start();

      try {
        await xAnchor.approveLimit({ token: 'UST' }, amount, address!);

        writer.repayUST();
        writer.timer.reset();

        const result = await xAnchor.repayStable(amount, address!, {
          handleEvent: (event) => {
            writer.repayUST(event);
            handleEvent(event);
          },
        });

        return result;
      } finally {
        writer.timer.stop();
      }
    },
    [xAnchor, address, connectionType, formatInput, microfy],
  );

  const displayTx = useCallback(
    (txParams: RepayUstTxParams) => ({
      txKind: TxKind.RepayUst,
      amount: `${formatOutput(txParams.amount as UST)} UST`,
      timestamp: Date.now(),
    }),
    [formatOutput],
  );

  const backgroundTxResult = useBackgroundTx<RepayUstTxParams>(
    repayTx,
    displayTx,
  );

  renderTxResultsRef.current = backgroundTxResult?.renderTxResults;

  return address ? backgroundTxResult : undefined;
}
