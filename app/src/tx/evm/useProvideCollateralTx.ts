import { StreamReturn } from '@rx-stream/react';
import { useEvmCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import { toWei, txResult, TX_GAS_LIMIT } from './utils';
import { Subject } from 'rxjs';
import { useCallback } from 'react';
import {
  Collateral,
  CrossChainTxResponse,
} from '@anchor-protocol/crossanchor-sdk';
import { ContractReceipt } from '@ethersproject/contracts';
import { useRedeemableTx } from './useRedeemableTx';

type TxResult = CrossChainTxResponse<ContractReceipt> | null;
type TxRender = TxResultRendering<TxResult>;
export interface ProvideCollateralTxProps {
  collateral: Collateral;
  amount: string;
}

export function useProvideCollateralTx():
  | StreamReturn<ProvideCollateralTxProps, TxRender>
  | [null, null] {
  const { address, connection, connectType, chainId } = useEvmWallet();
  const evmSdk = useEvmCrossAnchorSdk();

  const provideTx = useCallback(
    (
      txParams: ProvideCollateralTxProps,
      renderTxResults: Subject<TxRender>,
    ) => {
      return evmSdk.lockCollateral(
        txParams.collateral,
        toWei(txParams.amount),
        address!,
        TX_GAS_LIMIT,
        (event) => {
          console.log(event, 'eventEmitted');

          renderTxResults.next(
            txResult(event, connectType, chainId!, 'lock collateral'),
          );
        },
      );
    },
    [evmSdk, address, connectType, chainId],
  );

  const provideTxStream = useRedeemableTx(provideTx, (resp) => resp.tx, null);

  return chainId && connection && address ? provideTxStream : [null, null];
}
