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
import { aUST } from '@anchor-protocol/types';
import { TxEvent } from './useTx';
import { useRefetchQueries } from '@libs/app-provider';
import { EvmTxProgressWriter } from './EvmTxProgressWriter';

type WithdrawUstTxResult = TwoWayTxResponse<ContractReceipt> | null;
type WithdrawUstTxRender = TxResultRendering<WithdrawUstTxResult>;

export interface WithdrawUstTxParams {
  withdrawAmount: string;
}

export function useWithdrawUstTx():
  | BackgroundTxResult<WithdrawUstTxParams, WithdrawUstTxResult>
  | undefined {
  const { address, connectionType } = useEvmWallet();

  const xAnchor = useEvmCrossAnchorSdk();
  const refetchQueries = useRefetchQueries(EVM_ANCHOR_TX_REFETCH_MAP);

  const {
    aUST: { formatInput, microfy, formatOutput },
  } = useFormatters();

  const withdrawTx = useCallback(
    async (
      txParams: WithdrawUstTxParams,
      renderTxResults: Subject<WithdrawUstTxRender>,
      txEvents: Subject<TxEvent<WithdrawUstTxParams>>,
    ) => {
      const withdrawAmount = microfy(
        formatInput(txParams.withdrawAmount),
      ).toString();

      const writer = new EvmTxProgressWriter(renderTxResults, connectionType);
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
            txEvents.next({ event, txParams });
          },
        );

        refetchQueries(refetchQueryByTxKind(TxKind.WithdrawUst));

        return result;
      } finally {
        writer.timer.stop();
      }
    },
    [xAnchor, address, connectionType, formatInput, microfy, refetchQueries],
  );

  const displayTx = useCallback(
    (txParams: WithdrawUstTxParams) => ({
      txKind: TxKind.WithdrawUst,
      amount: `${formatOutput(txParams.withdrawAmount as aUST)} aUST`,
      timestamp: Date.now(),
    }),
    [formatOutput],
  );

  const persistedTxResult = useBackgroundTx<
    WithdrawUstTxParams,
    WithdrawUstTxResult
  >(withdrawTx, parseTx, null, displayTx);

  return address ? persistedTxResult : undefined;
}

const parseTx = (resp: NonNullable<WithdrawUstTxResult>) => resp.tx;
