import { useEvmCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import { Subject } from 'rxjs';
import { useCallback, useRef } from 'react';
import { ContractReceipt } from 'ethers';
import { CrossChainEventHandler } from '@anchor-protocol/crossanchor-sdk';
import { useFormatters } from '@anchor-protocol/formatter/useFormatters';
import { UST } from '@libs/types';
import { EvmTxProgressWriter } from './EvmTxProgressWriter';
import { TxKind } from './utils';
import { useBackgroundTx, BackgroundTxResult } from './useBackgroundTx';

export interface DepositUstTxParams {
  depositAmount: string;
}

export function useDepositUstTx():
  | BackgroundTxResult<DepositUstTxParams>
  | undefined {
  const { address, connectionType } = useEvmWallet();
  const xAnchor = useEvmCrossAnchorSdk();
  const {
    ust: { microfy, formatInput, formatOutput },
  } = useFormatters();
  const renderTxResultsRef =
    useRef<Subject<TxResultRendering<ContractReceipt | null>>>();

  const depositTx = useCallback(
    async (
      txParams: DepositUstTxParams,
      handleEvent: CrossChainEventHandler<ContractReceipt>,
    ) => {
      const depositAmount = microfy(
        formatInput(txParams.depositAmount),
      ).toString();

      const writer = new EvmTxProgressWriter(
        renderTxResultsRef.current!,
        connectionType,
      );
      writer.approveUST();
      writer.timer.start();

      try {
        await xAnchor.approveLimit({ token: 'UST' }, depositAmount, address!);

        writer.depositUST();
        writer.timer.reset();

        const response = await xAnchor.depositStable(depositAmount, address!, {
          handleEvent: (event) => {
            handleEvent(event);
            writer.depositUST(event);
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
    (txParams: DepositUstTxParams) => ({
      txKind: TxKind.DepositUst,
      amount: `${formatOutput(txParams.depositAmount as UST)} UST`,
      timestamp: Date.now(),
    }),
    [formatOutput],
  );

  const backgroundTxResult = useBackgroundTx<DepositUstTxParams>(
    depositTx,
    displayTx,
  );

  renderTxResultsRef.current = backgroundTxResult?.renderTxResults;

  return address ? backgroundTxResult : undefined;
}
