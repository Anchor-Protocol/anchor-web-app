import { StreamReturn } from '@rx-stream/react';
import { useEvmCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import { formatInput, txResult, TX_GAS_LIMIT } from './utils';
import { Subject } from 'rxjs';
import { useCallback } from 'react';
import { ContractReceipt } from 'ethers';
import { CrossChainTxResponse } from '@anchor-protocol/crossanchor-sdk';
import { useRedeemableTx } from './useRedeemableTx';
import { useFormatters } from '@anchor-protocol/formatter/useFormatters';
import { aUST } from '@anchor-protocol/types';

type TxResult = CrossChainTxResponse<ContractReceipt> | null;
type TxRender = TxResultRendering<TxResult>;

export interface WithdrawUstTxProps {
  withdrawAmount: string;
}

export function useWithdrawUstTx():
  | StreamReturn<WithdrawUstTxProps, TxRender>
  | [null, null] {
  const { address, connection, connectType, chainId } = useEvmWallet();
  const evmSdk = useEvmCrossAnchorSdk();
  const {
    aUST: { microfy },
  } = useFormatters();

  const withdrawTx = useCallback(
    (txParams: WithdrawUstTxProps, renderTxResults: Subject<TxRender>) => {
      return evmSdk.redeemStable(
        formatInput(microfy(txParams.withdrawAmount as aUST)),
        address!,
        TX_GAS_LIMIT,
        (event) => {
          console.log(event, 'eventEmitted');

          renderTxResults.next(
            txResult(event, connectType, chainId!, 'withdraw'),
          );
        },
      );
    },
    [evmSdk, address, connectType, chainId, microfy],
  );

  const withdrawTxStream = useRedeemableTx(withdrawTx, (resp) => resp.tx, null);

  return chainId && connection && address ? withdrawTxStream : [null, null];
}
