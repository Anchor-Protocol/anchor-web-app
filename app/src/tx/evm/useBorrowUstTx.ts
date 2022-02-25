import { StreamReturn } from '@rx-stream/react';
import { useEvmCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import { toWei, txResult, TX_GAS_LIMIT } from './utils';
import { Subject } from 'rxjs';
import { useCallback } from 'react';
import { CrossChainTxResponse } from '@anchor-protocol/crossanchor-sdk';
import { ContractReceipt } from 'ethers';
import { useRedeemableTx } from './useRedeemableTx';

type TxResult = CrossChainTxResponse<ContractReceipt> | null;
type TxRender = TxResultRendering<TxResult>;

export interface BorrowUstTxProps {
  amount: string;
}

export function useBorrowUstTx():
  | StreamReturn<BorrowUstTxProps, TxRender>
  | [null, null] {
  const { provider, address, connection, connectType } = useEvmWallet();
  const evmSdk = useEvmCrossAnchorSdk('testnet', provider);

  const borrowTx = useCallback(
    (txParams: BorrowUstTxProps, renderTxResults: Subject<TxRender>) => {
      return evmSdk.borrowStable(
        toWei(txParams.amount),
        address!,
        TX_GAS_LIMIT,
        (event) => {
          console.log(event, 'eventEmitted');

          renderTxResults.next(
            txResult(event, connectType, 'ethereum', 'borrow'),
          );
        },
      );
    },
    [address, connectType, evmSdk],
  );

  const borrowTxStream = useRedeemableTx(borrowTx, (resp) => resp.tx, null);

  return connection && address ? borrowTxStream : [null, null];
}
