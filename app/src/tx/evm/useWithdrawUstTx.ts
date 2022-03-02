import { useEvmCrossAnchorSdk } from 'crossanchor';
import { EvmChainId, useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import { txResult, TX_GAS_LIMIT, UseTxReturn } from './utils';
import { Subject } from 'rxjs';
import { useCallback } from 'react';
import { ContractReceipt } from 'ethers';
import {
  CrossChainEventHandler,
  CrossChainTxResponse,
} from '@anchor-protocol/crossanchor-sdk';
import { useRedeemableTx } from './useRedeemableTx';
import { useFormatters } from '@anchor-protocol/formatter/useFormatters';
import { aUST } from '@anchor-protocol/types';

type TxResult = CrossChainTxResponse<ContractReceipt> | null;

type TxRender = TxResultRendering<TxResult>;

export interface WithdrawUstTxProps {
  withdrawAmount: string;
}

export function useWithdrawUstTx(): UseTxReturn<WithdrawUstTxProps, TxResult> {
  const {
    address,
    connection,
    connectType,
    chainId = EvmChainId.ETHEREUM_ROPSTEN,
  } = useEvmWallet();

  const xAnchor = useEvmCrossAnchorSdk();

  const {
    aUST: { formatInput, microfy, formatOutput },
  } = useFormatters();

  const withdrawTx = useCallback(
    async (
      txParams: WithdrawUstTxProps,
      renderTxResults: Subject<TxRender>,
      handleEvent: CrossChainEventHandler,
    ) => {
      const withdrawAmount = microfy(
        formatInput(txParams.withdrawAmount),
      ).toString();

      await xAnchor.approveLimit(
        'aust',
        withdrawAmount,
        address!,
        TX_GAS_LIMIT,
        (event) => {
          renderTxResults.next(
            txResult(event, connectType, chainId, 'withdraw'),
          );
          handleEvent(event);
        },
      );

      return await xAnchor.redeemStable(
        withdrawAmount,
        address!,
        TX_GAS_LIMIT,
        (event) => {
          renderTxResults.next(
            txResult(event, connectType, chainId, 'withdraw'),
          );
          handleEvent(event);
        },
      );
    },
    [xAnchor, address, connectType, formatInput, microfy, chainId],
  );

  const withdrawTxStream = useRedeemableTx(
    withdrawTx,
    (resp) => resp.tx,
    null,
    (txParams) => ({
      action: 'redeemStable',
      amount: `${formatOutput(txParams.withdrawAmount as aUST)} aUST`,
    }),
  );

  return chainId && connection && address ? withdrawTxStream : [null, null];
}
