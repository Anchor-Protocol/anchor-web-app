import { useEvmCrossAnchorSdk } from 'crossanchor';
import { EvmChainId, useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import { txResult, TX_GAS_LIMIT } from './utils';
import { Subject } from 'rxjs';
import { useCallback } from 'react';
import { ContractReceipt } from 'ethers';
import { TwoWayTxResponse } from '@anchor-protocol/crossanchor-sdk';
import { PersistedTxResult, usePersistedTx } from './usePersistedTx';
import { useFormatters } from '@anchor-protocol/formatter/useFormatters';
import { aUST } from '@anchor-protocol/types';
import { TxEventHandler } from './useTx';

type WithdrawUstTxResult = TwoWayTxResponse<ContractReceipt> | null;
type WithdrawUstTxRender = TxResultRendering<WithdrawUstTxResult>;

export interface WithdrawUstTxParams {
  withdrawAmount: string;
}

export function useWithdrawUstTx():
  | PersistedTxResult<WithdrawUstTxParams, WithdrawUstTxResult>
  | undefined {
  const {
    address,
    connection,
    connectType,
    chainId = EvmChainId.ETHEREUM_ROPSTEN,
  } = useEvmWallet();

  const xAnchor = useEvmCrossAnchorSdk();

  const {
    aUST: { formatInput, microfy, formatOutput },
  } = useFormatters();

  const withdrawTx = useCallback(
    async (
      txParams: WithdrawUstTxParams,
      renderTxResults: Subject<WithdrawUstTxRender>,
      handleEvent: TxEventHandler<WithdrawUstTxParams>,
    ) => {
      const withdrawAmount = microfy(
        formatInput(txParams.withdrawAmount),
      ).toString();

      await xAnchor.approveLimit(
        { token: 'aust' },
        withdrawAmount,
        address!,
        TX_GAS_LIMIT,
        (event) => {
          renderTxResults.next(
            txResult(event, connectType, chainId, 'withdraw'),
          );
          handleEvent(event, txParams);
        },
      );

      return await xAnchor.redeemStable(
        withdrawAmount,
        address!,
        TX_GAS_LIMIT,
        (event) => {
          renderTxResults.next(
            txResult(event, connectType, chainId, 'withdraw'),
          );
          handleEvent(event, txParams);
        },
      );
    },
    [xAnchor, address, connectType, formatInput, microfy, chainId],
  );

  const persistedTxResult = usePersistedTx<
    WithdrawUstTxParams,
    WithdrawUstTxResult
  >(
    withdrawTx,
    (resp) => resp.tx,
    null,
    (txParams) => ({
      action: 'redeemStable',
      amount: `${formatOutput(txParams.withdrawAmount as aUST)} aUST`,
      timestamp: Date.now(),
    }),
  );

  return chainId && connection && address ? persistedTxResult : undefined;
}
