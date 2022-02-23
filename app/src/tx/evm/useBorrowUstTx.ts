import { StreamReturn } from '@rx-stream/react';
import { useEthCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import { useTx } from './useTx';
import { toWei, txResult, TX_GAS_LIMIT } from './utils';
import { Subject } from 'rxjs';
import { useCallback } from 'react';

export interface BorrowUstTxProps {
  amount: string;
}

export function useBorrowUstTx():
  | StreamReturn<BorrowUstTxProps, TxResultRendering>
  | [null, null] {
  const { provider, address, connection, connectType } = useEvmWallet();
  const ethSdk = useEthCrossAnchorSdk('testnet', provider);

  const borrowTx = useCallback(
    (
      txParams: BorrowUstTxProps,
      renderTxResults: Subject<TxResultRendering>,
    ) => {
      return ethSdk.borrowStable(
        toWei(txParams.amount),
        address!,
        TX_GAS_LIMIT,
        (event) => {
          console.log(event, 'eventEmitted');

          renderTxResults.next(txResult(event, connectType));
        },
      );
    },
    [address, connectType, ethSdk],
  );

  const borrowTxStream = useTx(borrowTx);

  return connection && address ? borrowTxStream : [null, null];
}
