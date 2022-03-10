import { useEvmCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import { txResult, TX_GAS_LIMIT } from './utils';
import { Subject } from 'rxjs';
import { useCallback } from 'react';
import { OneWayTxResponse } from '@anchor-protocol/crossanchor-sdk';
import { ContractReceipt } from 'ethers';
import { BackgroundTxResult, useBackgroundTx } from './useBackgroundTx';
import { useFormatters } from '@anchor-protocol/formatter/useFormatters';
import { UST } from '@libs/types';
import { TxEvent } from './useTx';

type RepayUstTxResult = OneWayTxResponse<ContractReceipt> | null;
type RepayUstTxRender = TxResultRendering<RepayUstTxResult>;

export interface RepayUstTxParams {
  amount: string;
}

export function useRepayUstTx():
  | BackgroundTxResult<RepayUstTxParams, RepayUstTxResult>
  | undefined {
  const { address, connection, connectType, chainId } = useEvmWallet();
  const xAnchor = useEvmCrossAnchorSdk();
  const {
    ust: { microfy, formatInput, formatOutput },
  } = useFormatters();

  const repayTx = useCallback(
    async (
      txParams: RepayUstTxParams,
      renderTxResults: Subject<RepayUstTxRender>,
      txEvents: Subject<TxEvent<RepayUstTxParams>>,
    ) => {
      const amount = microfy(formatInput(txParams.amount)).toString();

      await xAnchor.approveLimit(
        { token: 'ust' },
        amount,
        address!,
        TX_GAS_LIMIT,
        (event) => {
          renderTxResults.next(txResult(event, connectType, chainId!, 'repay'));
          txEvents.next({ event, txParams });
        },
      );

      return xAnchor.repayStable(amount, address!, TX_GAS_LIMIT, (event) => {
        console.log(event, 'eventEmitted ');

        renderTxResults.next(txResult(event, connectType, chainId!, 'repay'));
        txEvents.next({ event, txParams });
      });
    },
    [xAnchor, address, connectType, chainId, formatInput, microfy],
  );

  const persistedTxResult = useBackgroundTx<RepayUstTxParams, RepayUstTxResult>(
    repayTx,
    (resp) => resp.tx,
    null,
    (txParams) => ({
      action: 'repayStable',
      amount: `${formatOutput(txParams.amount as UST)} UST`,
      timestamp: Date.now(),
    }),
  );

  return chainId && connection && address ? persistedTxResult : undefined;
}
