import { TwoWayTxResponse } from '@anchor-protocol/crossanchor-sdk';
import { TxResultRendering } from '@libs/app-fns';
import { useRefetchQueries } from '@libs/app-provider';
import { useEvmWallet } from '@libs/evm-wallet';
import { useEvmCrossAnchorSdk } from 'crossanchor';
import { ContractReceipt } from 'ethers';
import { useCallback } from 'react';
import { Subject } from 'rxjs';
import { useBackgroundTx } from './useBackgroundTx';
import { TxEvent } from './useTx';
import {
  EVM_ANCHOR_TX_REFETCH_MAP,
  refetchQueryByTxKind,
  TxKind,
  txResult,
  TX_GAS_LIMIT,
} from './utils';

type WithdrawAssetsTxResult = TwoWayTxResponse<ContractReceipt> | null;
type WithdrawAssetsTxRender = TxResultRendering<WithdrawAssetsTxResult>;

export interface WithdrawAssetsTxParams {
  tokenContract: string;
  amount: string;
  symbol: string;
}

export const useWithdrawAssetsTx = () => {
  const { connection, provider, address, connectType, chainId } =
    useEvmWallet();

  const xAnchor = useEvmCrossAnchorSdk();
  const refetchQueries = useRefetchQueries(EVM_ANCHOR_TX_REFETCH_MAP);

  const withdrawTx = useCallback(
    async (
      txParams: WithdrawAssetsTxParams,
      renderTxResults: Subject<WithdrawAssetsTxRender>,
      txEvents: Subject<TxEvent<WithdrawAssetsTxParams>>,
    ) => {
      try {
        const result = await xAnchor.withdrawAssets(
          { contract: txParams.tokenContract },
          address!,
          TX_GAS_LIMIT,
          (event) => {
            renderTxResults.next(
              txResult(event, connectType, chainId!, TxKind.WithdrawAssets),
            );
            txEvents.next({ event, txParams });
          },
        );
        refetchQueries(refetchQueryByTxKind(TxKind.WithdrawAssets));
        return result;
      } catch (error: any) {
        console.log(error);
        throw error;
      }
    },
    [xAnchor, chainId, connectType, address, refetchQueries],
  );

  const withdrawAssetsTx = useBackgroundTx<
    WithdrawAssetsTxParams,
    WithdrawAssetsTxResult
  >(
    withdrawTx,
    (resp) => resp.tx,
    null,
    (txParams) => ({
      txKind: TxKind.WithdrawAssets,
      amount: `${txParams.amount} ${txParams.symbol}`,
      timestamp: Date.now(),
    }),
  );

  return connection && provider && connectType && chainId && address
    ? withdrawAssetsTx
    : undefined;
};
