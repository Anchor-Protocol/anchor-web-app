import { useEvmCrossAnchorSdk } from 'crossanchor';
import { EvmChainId, useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import {
  EVM_ANCHOR_TX_REFETCH_MAP,
  refetchQueryByTxKind,
  TxKind,
  TX_GAS_LIMIT,
} from './utils';
import { Subject } from 'rxjs';
import { useCallback } from 'react';
import { TwoWayTxResponse } from '@anchor-protocol/crossanchor-sdk';
import { ContractReceipt } from 'ethers';
import { BackgroundTxResult, useBackgroundTx } from './useBackgroundTx';
import { useFormatters } from '@anchor-protocol/formatter/useFormatters';
import { UST } from '@libs/types';
import { TxEvent } from './useTx';
import { useRefetchQueries } from '@libs/app-provider';
import { EvmTxProgressWriter } from './EvmTxProgressWriter';

type BorrowUstTxResult = TwoWayTxResponse<ContractReceipt> | null;
type BorrowUstTxRender = TxResultRendering<BorrowUstTxResult>;

export interface BorrowUstTxParams {
  amount: UST;
}

export function useBorrowUstTx():
  | BackgroundTxResult<BorrowUstTxParams, BorrowUstTxResult>
  | undefined {
  const {
    address,
    connection,
    connectType,
    chainId = EvmChainId.ETHEREUM_ROPSTEN,
  } = useEvmWallet();
  const xAnchor = useEvmCrossAnchorSdk();
  const {
    ust: { microfy, formatInput, formatOutput },
  } = useFormatters();
  const refetchQueries = useRefetchQueries(EVM_ANCHOR_TX_REFETCH_MAP);

  const borrowTx = useCallback(
    async (
      txParams: BorrowUstTxParams,
      renderTxResults: Subject<BorrowUstTxRender>,
      txEvents: Subject<TxEvent<BorrowUstTxParams>>,
    ) => {
      const amount = microfy(formatInput(txParams.amount)).toString();

      const writer = new EvmTxProgressWriter(
        renderTxResults,
        chainId,
        connectType,
      );
      writer.approveUST();
      writer.timer.start();

      try {
        await xAnchor.approveLimit(
          { token: 'ust' },
          amount,
          address!,
          TX_GAS_LIMIT,
          (event) => {
            txEvents.next({ event, txParams });
          },
        );

        writer.borrowUST();
        writer.timer.reset();

        const result = await xAnchor.borrowStable(
          amount,
          address!,
          TX_GAS_LIMIT,
          (event) => {
            writer.borrowUST(event);
            txEvents.next({ event, txParams });
          },
        );

        refetchQueries(refetchQueryByTxKind(TxKind.BorrowUst));

        return result;
      } finally {
        writer.timer.stop();
      }
    },
    [
      address,
      connectType,
      xAnchor,
      chainId,
      microfy,
      formatInput,
      refetchQueries,
    ],
  );

  const persistedTxResult = useBackgroundTx<
    BorrowUstTxParams,
    BorrowUstTxResult
  >(
    borrowTx,
    (resp) => resp.tokenTransfer,
    null,
    (txParams) => ({
      txKind: TxKind.BorrowUst,
      amount: `${formatOutput(txParams.amount as UST)} UST`,
      timestamp: Date.now(),
    }),
  );

  return chainId && connection && address ? persistedTxResult : undefined;
}
