import { useEvmCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import {
  EVM_ANCHOR_TX_REFETCH_MAP,
  refetchQueryByTxKind,
  TxKind,
  TX_GAS_LIMIT,
} from './utils';
import { Subject } from 'rxjs';
import { useCallback } from 'react';
import { ContractReceipt } from 'ethers';
import { TwoWayTxResponse } from '@anchor-protocol/crossanchor-sdk';
import { BackgroundTxResult, useBackgroundTx } from './useBackgroundTx';
import { useFormatters } from '@anchor-protocol/formatter/useFormatters';
import { UST } from '@libs/types';
import { TxEvent } from './useTx';
import { useRefetchQueries } from '@libs/app-provider';
import { EvmTxProgressWriter } from './EvmTxProgressWriter';

type DepositUstTxResult = TwoWayTxResponse<ContractReceipt> | null;
type DepositUstTxRender = TxResultRendering<DepositUstTxResult>;

export interface DepositUstTxParams {
  depositAmount: string;
}

export function useDepositUstTx():
  | BackgroundTxResult<DepositUstTxParams, DepositUstTxResult>
  | undefined {
  const { address, connectionType } = useEvmWallet();
  const xAnchor = useEvmCrossAnchorSdk();
  const {
    ust: { microfy, formatInput, formatOutput },
  } = useFormatters();
  const refetchQueries = useRefetchQueries(EVM_ANCHOR_TX_REFETCH_MAP);

  const depositTx = useCallback(
    async (
      txParams: DepositUstTxParams,
      renderTxResults: Subject<DepositUstTxRender>,
      txEvents: Subject<TxEvent<DepositUstTxParams>>,
    ) => {
      const depositAmount = microfy(
        formatInput(txParams.depositAmount),
      ).toString();

      const writer = new EvmTxProgressWriter(renderTxResults, connectionType);
      writer.approveUST();
      writer.timer.start();

      try {
        await xAnchor.approveLimit(
          { token: 'UST' },
          depositAmount,
          address!,
          TX_GAS_LIMIT,
        );

        writer.depositUST();
        writer.timer.reset();

        const response = await xAnchor.depositStable(
          depositAmount,
          address!,
          TX_GAS_LIMIT,
          (event) => {
            txEvents.next({ event, txParams });
            writer.depositUST(event);
          },
        );

        refetchQueries(refetchQueryByTxKind(TxKind.DepositUst));

        return response;
      } finally {
        writer.timer.stop();
      }
    },
    [address, connectionType, xAnchor, microfy, formatInput, refetchQueries],
  );

  const displayTx = useCallback(
    (txParams: DepositUstTxParams) => ({
      txKind: TxKind.DepositUst,
      amount: `${formatOutput(txParams.depositAmount as UST)} UST`,
      timestamp: Date.now(),
    }),
    [formatOutput],
  );

  const persistedTxResult = useBackgroundTx<
    DepositUstTxParams,
    DepositUstTxResult
  >(depositTx, parseTx, null, displayTx);

  return address ? persistedTxResult : undefined;
}

const parseTx = (resp: NonNullable<DepositUstTxResult>) => resp.tx;
