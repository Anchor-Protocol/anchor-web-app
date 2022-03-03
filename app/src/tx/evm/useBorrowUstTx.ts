import { StreamReturn } from '@rx-stream/react';
import { useEvmCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import { txResult, TX_GAS_LIMIT } from './utils';
import { Subject } from 'rxjs';
import { useCallback } from 'react';
import { CrossChainTxResponse } from '@anchor-protocol/crossanchor-sdk';
import { ContractReceipt } from 'ethers';
import { useRedeemableTx } from './useRedeemableTx';
import { useFormatters } from '@anchor-protocol/formatter/useFormatters';
import { UST } from '@libs/types';
import { TxEventHandler } from './useTx';

type TxResult = CrossChainTxResponse<ContractReceipt> | null;
type TxRender = TxResultRendering<TxResult>;

export interface BorrowUstTxProps {
  amount: string;
}

export function useBorrowUstTx():
  | StreamReturn<BorrowUstTxProps, TxRender>
  | [null, null] {
  const { address, connection, connectType, chainId } = useEvmWallet();
  const xAnchor = useEvmCrossAnchorSdk();
  const {
    ust: { microfy, formatInput, formatOutput },
  } = useFormatters();

  const borrowTx = useCallback(
    async (
      txParams: BorrowUstTxProps,
      renderTxResults: Subject<TxRender>,
      handleEvent: TxEventHandler<BorrowUstTxProps>,
    ) => {
      const amount = microfy(formatInput(txParams.amount)).toString();

      await xAnchor.approveLimit(
        'ust',
        amount,
        address!,
        TX_GAS_LIMIT,
        (event) => {
          renderTxResults.next(
            txResult(event, connectType, chainId!, 'borrow'),
          );
          handleEvent(event, txParams);
        },
      );

      return xAnchor.borrowStable(amount, address!, TX_GAS_LIMIT, (event) => {
        console.log(event, 'eventEmitted');

        renderTxResults.next(txResult(event, connectType, chainId!, 'borrow'));
        handleEvent(event, txParams);
      });
    },
    [address, connectType, xAnchor, chainId, microfy, formatInput],
  );

  const borrowTxStream = useRedeemableTx(
    borrowTx,
    (resp) => resp.tx,
    null,
    (txParams) => ({
      action: 'borrowStable',
      amount: `${formatOutput(txParams.amount as UST)} UST`,
    }),
  );

  return chainId && connection && address ? borrowTxStream : [null, null];
}
