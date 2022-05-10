import { useEvmSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import {
  EVM_ANCHOR_TX_REFETCH_MAP,
  refetchQueryByTxKind,
  TxKind,
} from './utils';
import { Subject } from 'rxjs';
import { useCallback } from 'react';
import { ContractReceipt } from 'ethers';
import { BackgroundTxResult, useBackgroundTx } from './useBackgroundTx';
import { useFormatters } from '@anchor-protocol/formatter/useFormatters';
import { UST } from '@libs/types';
import { TxEvent } from './useTx';
import { useRefetchQueries } from '@libs/app-provider';
import { EvmTxProgressWriter } from './EvmTxProgressWriter';

type RepayUstTxResult = ContractReceipt | null;
type RepayUstTxRender = TxResultRendering<RepayUstTxResult>;

export interface RepayUstTxParams {
  amount: string;
}

export function useRepayUstTx():
  | BackgroundTxResult<RepayUstTxParams, RepayUstTxResult>
  | undefined {
  const { address, connectionType } = useEvmWallet();
  const xAnchor = useEvmSdk();
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

      const writer = new EvmTxProgressWriter(renderTxResults, connectionType);
      writer.approveUST();
      writer.timer.start();

      try {
        await xAnchor.approveLimit(address!, { token: 'UST' }, amount);

        writer.repayUST();
        writer.timer.reset();

        const result = await xAnchor.repayStable(address!, amount, {
          handleEvent: (event) => {
            writer.repayUST(event);
            txEvents.next({ event, txParams });
          },
        });

        refetchQueries(refetchQueryByTxKind(TxKind.RepayUst));

        return result;
      } finally {
        writer.timer.stop();
      }
    },
    [xAnchor, address, connectionType, formatInput, microfy, refetchQueries],
  );

  const displayTx = useCallback(
    (txParams: RepayUstTxParams) => ({
      txKind: TxKind.RepayUst,
      amount: `${formatOutput(txParams.amount as UST)} UST`,
      timestamp: Date.now(),
    }),
    [formatOutput],
  );

  const persistedTxResult = useBackgroundTx<RepayUstTxParams, RepayUstTxResult>(
    repayTx,
    parseTx,
    null,
    displayTx,
  );

  return address ? persistedTxResult : undefined;
}

const parseTx = (resp: NonNullable<RepayUstTxResult>) => resp;
