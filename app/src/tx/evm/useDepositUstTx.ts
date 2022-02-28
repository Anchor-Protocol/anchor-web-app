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
import { UST } from '@libs/types';

type TxResult = CrossChainTxResponse<ContractReceipt> | null;
type TxRender = TxResultRendering<TxResult>;

export interface DepositUstTxProps {
  depositAmount: string;
}

export function useDepositUstTx():
  | StreamReturn<DepositUstTxProps, TxRender>
  | [null, null] {
  const { address, connection, connectType, chainId } = useEvmWallet();
  const evmSdk = useEvmCrossAnchorSdk();
  const {
    ust: { microfy },
  } = useFormatters();

  const depositTx = useCallback(
    async (txParams: DepositUstTxProps, renderTxResults: Subject<TxRender>) => {
      return evmSdk.depositStable(
        formatInput(microfy(txParams.depositAmount as UST)),
        address!,
        TX_GAS_LIMIT,
        (event) => {
          console.log(event, 'eventEmitted');

          renderTxResults.next(
            txResult(event, connectType, chainId!, 'deposit'),
          );
        },
      );
    },
    [address, connectType, evmSdk, chainId, microfy],
  );

  const depositTxStream = useRedeemableTx(depositTx, (resp) => resp.tx, null);

  return chainId && connection && address ? depositTxStream : [null, null];
}
