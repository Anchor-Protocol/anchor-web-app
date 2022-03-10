import { useEvmCrossAnchorSdk } from 'crossanchor';
import { EvmChainId, useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import { txResult, TX_GAS_LIMIT } from './utils';
import { Subject } from 'rxjs';
import { useCallback } from 'react';
import { ContractReceipt } from 'ethers';
import { TwoWayTxResponse } from '@anchor-protocol/crossanchor-sdk';
import { BackgroundTxResult, useBackgroundTx } from './useBackgroundTx';
import { useFormatters } from '@anchor-protocol/formatter/useFormatters';
import { UST } from '@libs/types';
import { TxEvent } from './useTx';
import { EvmTxProgressWriter } from './EvmTxProgressWriter';

type DepositUstTxResult = TwoWayTxResponse<ContractReceipt> | null;
type DepositUstTxRender = TxResultRendering<DepositUstTxResult>;

export interface DepositUstTxParams {
  depositAmount: string;
}

export function useDepositUstTx():
  | BackgroundTxResult<DepositUstTxParams, DepositUstTxResult>
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

  const depositTx = useCallback(
    async (
      txParams: DepositUstTxParams,
      renderTxResults: Subject<DepositUstTxRender>,
      txEvents: Subject<TxEvent<DepositUstTxParams>>,
    ) => {
      const depositAmount = microfy(
        formatInput(txParams.depositAmount),
      ).toString();

      const writer = new EvmTxProgressWriter(
        renderTxResults,
        chainId,
        connectType,
      );
      writer.writeApproval();

      await xAnchor.approveLimit(
        { token: 'ust' },
        depositAmount,
        address!,
        TX_GAS_LIMIT,
        (event) => {
          renderTxResults.next(
            txResult(event, connectType, chainId, 'deposit'),
          );
          txEvents.next({ event, txParams });
        },
      );

      writer.writeDeposit();

      const response = await xAnchor.depositStable(
        depositAmount,
        address!,
        TX_GAS_LIMIT,
        (event) => {
          console.log(event, 'eventEmitted');
          txEvents.next({ event, txParams });
          renderTxResults.next(
            txResult(event, connectType, chainId, 'deposit'),
          );
        },
      );

      return response;
    },
    [address, connectType, xAnchor, chainId, microfy, formatInput],
  );

  const displayTx = useCallback(
    (txParams: DepositUstTxParams) => ({
      action: 'depositStable',
      amount: `${formatOutput(txParams.depositAmount as UST)} UST`,
      timestamp: Date.now(),
    }),
    [formatOutput],
  );

  const persistedTxResult = useBackgroundTx<
    DepositUstTxParams,
    DepositUstTxResult
  >(depositTx, (resp) => resp.tx, null, displayTx);

  return chainId && connection && address ? persistedTxResult : undefined;
}
