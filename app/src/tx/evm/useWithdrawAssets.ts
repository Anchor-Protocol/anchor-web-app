import { TwoWayTxResponse } from '@anchor-protocol/crossanchor-sdk';
import { CW20TokenDisplayInfo, TxResultRendering } from '@libs/app-fns';
import { useEvmWallet } from '@libs/evm-wallet';
import { useEvmCrossAnchorSdk } from 'crossanchor';
import { ContractReceipt } from 'ethers';
import { useCallback } from 'react';
import { Subject } from 'rxjs';
import { TxEvent, useTx } from './useTx';
import { TxKind, txResult, TX_GAS_LIMIT } from './utils';

type TxResult = TwoWayTxResponse<ContractReceipt> | null;
type TxRender = TxResultRendering<TxResult>;

export interface WithdrawAssetsTxParams {
  tokenContract: string;
  tokenDisplay: CW20TokenDisplayInfo;
}

export const useWithdrawAssetsTx = () => {
  const { connection, provider, address, connectType, chainId } =
    useEvmWallet();

  const xAnchor = useEvmCrossAnchorSdk();

  const withdrawTx = useCallback(
    async (
      txParams: WithdrawAssetsTxParams,
      renderTxResults: Subject<TxRender>,
      txEvents: Subject<TxEvent<WithdrawAssetsTxParams>>,
    ) => {
      try {
        const result = await xAnchor.withdrawAssets(
          { contract: txParams.tokenContract },
          address!,
          TX_GAS_LIMIT,
          (event) => {
            console.log(event, 'eventEmitted ');

            renderTxResults.next(
              txResult(event, connectType, chainId!, TxKind.WithdrawAssets),
            );
            txEvents.next({ event, txParams });
          },
        );
        return result;
      } catch (error: any) {
        console.log(error);
        throw error;
      }
    },
    [xAnchor, chainId, connectType, address],
  );

  const withdrawAssetsTx = useTx(withdrawTx, (resp) => resp.tx, null);

  return connection && provider && connectType && chainId && address
    ? withdrawAssetsTx
    : [null, null];
};
