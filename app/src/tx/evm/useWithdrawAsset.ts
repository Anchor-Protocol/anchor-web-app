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
} from './utils';

type WithdrawAssetTxResult = TwoWayTxResponse<ContractReceipt> | null;
type WithdrawAssetTxRender = TxResultRendering<WithdrawAssetTxResult>;

export interface WithdrawAssetTxParams {
  tokenContract: string;
  amount: string;
  symbol: string;
}

export const useWithdrawAssetTx = () => {
  const { provider, address, connectionType, chainId } = useEvmWallet();

  const xAnchor = useEvmCrossAnchorSdk();
  const refetchQueries = useRefetchQueries(EVM_ANCHOR_TX_REFETCH_MAP);

  const withdrawTx = useCallback(
    async (
      txParams: WithdrawAssetTxParams,
      renderTxResults: Subject<WithdrawAssetTxRender>,
      txEvents: Subject<TxEvent<WithdrawAssetTxParams>>,
    ) => {
      try {
        const result = await xAnchor.withdrawAsset(
          { contract: txParams.tokenContract },
          address!,
          {
            handleEvent: (event) => {
              renderTxResults.next(
                txResult(event, connectionType, chainId!, TxKind.WithdrawAsset),
              );
              txEvents.next({ event, txParams });
            },
          },
        );
        refetchQueries(refetchQueryByTxKind(TxKind.WithdrawAsset));
        return result;
      } catch (error: any) {
        console.log(error);
        throw error;
      }
    },
    [xAnchor, chainId, connectionType, address, refetchQueries],
  );

  const withdrawAssetTx = useBackgroundTx<
    WithdrawAssetTxParams,
    WithdrawAssetTxResult
  >(withdrawTx, parseTx, null, displayTx);

  return provider && connectionType && chainId && address
    ? withdrawAssetTx
    : undefined;
};

const displayTx = (txParams: WithdrawAssetTxParams) => ({
  txKind: TxKind.WithdrawAsset,
  amount: `${txParams.amount} ${txParams.symbol}`,
  timestamp: Date.now(),
});

const parseTx = (resp: NonNullable<WithdrawAssetTxResult>) => resp.tx;
