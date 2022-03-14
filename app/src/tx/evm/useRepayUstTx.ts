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
import { OneWayTxResponse } from '@anchor-protocol/crossanchor-sdk';
import { ContractReceipt } from 'ethers';
import { BackgroundTxResult, useBackgroundTx } from './useBackgroundTx';
import { useFormatters } from '@anchor-protocol/formatter/useFormatters';
import { UST } from '@libs/types';
import { TxEvent } from './useTx';
import { useRefetchQueries } from '@libs/app-provider';
import { EvmTxProgressWriter } from './EvmTxProgressWriter';

type RepayUstTxResult = OneWayTxResponse<ContractReceipt> | null;
type RepayUstTxRender = TxResultRendering<RepayUstTxResult>;

export interface RepayUstTxParams {
  amount: string;
}

export function useRepayUstTx():
  | BackgroundTxResult<RepayUstTxParams, RepayUstTxResult>
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

  const repayTx = useCallback(
    async (
      txParams: RepayUstTxParams,
      renderTxResults: Subject<RepayUstTxRender>,
      txEvents: Subject<TxEvent<RepayUstTxParams>>,
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

        writer.repayUST();
        writer.timer.reset();

        const result = await xAnchor.repayStable(
          amount,
          address!,
          TX_GAS_LIMIT,
          (event) => {
            writer.repayUST(event);
            txEvents.next({ event, txParams });
          },
        );

        refetchQueries(refetchQueryByTxKind(TxKind.RepayUst));

        return result;
      } finally {
        writer.timer.stop();
      }
    },
    [
      xAnchor,
      address,
      connectType,
      chainId,
      formatInput,
      microfy,
      refetchQueries,
    ],
  );

  const persistedTxResult = useBackgroundTx<RepayUstTxParams, RepayUstTxResult>(
    repayTx,
    (resp) => resp.tx,
    null,
    (txParams) => ({
      txKind: TxKind.RepayUst,
      amount: `${formatOutput(txParams.amount as UST)} UST`,
      timestamp: Date.now(),
    }),
  );

  return chainId && connection && address ? persistedTxResult : undefined;
}
