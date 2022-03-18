import { CrossChainTxResponse } from '@anchor-protocol/crossanchor-sdk';
import { TxResultRendering } from '@libs/app-fns';
import { useEvmWallet } from '@libs/evm-wallet';
import { useEvmCrossAnchorSdk } from 'crossanchor';
import { ContractReceipt } from 'ethers';
import { useCallback } from 'react';
import { Subject } from 'rxjs';
import { EvmTxProgressWriter } from './EvmTxProgressWriter';
import { useTransactions } from './storage';
import { TxEvent, useTx } from './useTx';
import { errorContains, TxError } from './utils';

type TxResult = CrossChainTxResponse<ContractReceipt> | null;
type TxRender = TxResultRendering<TxResult>;

export interface RestoreTxParams {
  txHash: string;
}

export const useRestoreTx = () => {
  const { connection, provider, connectType, chainId } = useEvmWallet();
  const xAnchor = useEvmCrossAnchorSdk();
  const { removeTransaction } = useTransactions();

  const restoreTx = useCallback(
    async (
      txParams: RestoreTxParams,
      renderTxResults: Subject<TxRender>,
      txEvents: Subject<TxEvent<RestoreTxParams>>,
    ) => {
      const writer = new EvmTxProgressWriter(
        renderTxResults,
        chainId!,
        connectType,
      );
      writer.restoreTx();
      writer.timer.start();

      try {
        const result = await xAnchor.restoreTx(txParams.txHash, (event) => {
          writer.restoreTx(event);
          txEvents.next({ event, txParams });
        });

        removeTransaction(txParams.txHash);
        return result;
      } catch (error: any) {
        if (errorContains(error, TxError.TxAlreadyProcessed)) {
          removeTransaction(txParams.txHash);
          return null;
        }

        console.log(error);
        throw error;
      } finally {
        writer.timer.stop();
      }
    },
    [xAnchor, chainId, connectType, removeTransaction],
  );

  const restoreTxStream = useTx(restoreTx, (resp) => resp.tx, null);

  return connection && provider && connectType && chainId
    ? restoreTxStream
    : [null, null];
};
