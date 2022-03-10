import { useEvmCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import { txResult, TX_GAS_LIMIT } from './utils';
import { Subject } from 'rxjs';
import { useCallback } from 'react';
import { TwoWayTxResponse } from '@anchor-protocol/crossanchor-sdk';
import { ContractReceipt } from 'ethers';
import { BackgroundTxResult, useBackgroundTx } from './useBackgroundTx';
import { useFormatters } from '@anchor-protocol/formatter/useFormatters';
import { UST } from '@libs/types';
import { TxEvent } from './useTx';

type BorrowUstTxResult = TwoWayTxResponse<ContractReceipt> | null;
type BorrowUstTxRender = TxResultRendering<BorrowUstTxResult>;

export interface BorrowUstTxParams {
  amount: UST;
}

export function useBorrowUstTx():
  | BackgroundTxResult<BorrowUstTxParams, BorrowUstTxResult>
  | undefined {
  const { address, connection, connectType, chainId } = useEvmWallet();
  const xAnchor = useEvmCrossAnchorSdk();
  const {
    ust: { microfy, formatInput, formatOutput },
  } = useFormatters();

  const borrowTx = useCallback(
    async (
      txParams: BorrowUstTxParams,
      renderTxResults: Subject<BorrowUstTxRender>,
      txEvents: Subject<TxEvent<BorrowUstTxParams>>,
    ) => {
      const amount = microfy(formatInput(txParams.amount)).toString();

      await xAnchor.approveLimit(
        { token: 'ust' },
        amount,
        address!,
        TX_GAS_LIMIT,
        (event) => {
          renderTxResults.next(
            txResult(event, connectType, chainId!, 'borrow'),
          );
          txEvents.next({ event, txParams });
        },
      );

      return xAnchor.borrowStable(amount, address!, TX_GAS_LIMIT, (event) => {
        console.log(event, 'eventEmitted');

        renderTxResults.next(txResult(event, connectType, chainId!, 'borrow'));
        txEvents.next({ event, txParams });
      });
    },
    [address, connectType, xAnchor, chainId, microfy, formatInput],
  );

  const persistedTxResult = useBackgroundTx<
    BorrowUstTxParams,
    BorrowUstTxResult
  >(
    borrowTx,
    (resp) => resp.tokenTransfer,
    null,
    (txParams) => ({
      action: 'borrowStable',
      amount: `${formatOutput(txParams.amount as UST)} UST`,
      timestamp: Date.now(),
    }),
  );

  return chainId && connection && address ? persistedTxResult : undefined;
}
