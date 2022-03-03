import {
  CrossChainEvent,
  CrossChainEventKind,
} from '@anchor-protocol/crossanchor-sdk';
import { TxResultRendering, TxStreamPhase } from '@libs/app-fns';
import { ConnectType, EvmChainId, useEvmWallet } from '@libs/evm-wallet';
import { useEvmCrossAnchorSdk } from 'crossanchor';
import { ContractReceipt } from 'ethers';
import { useCallback } from 'react';
import { Subject } from 'rxjs';
import { TxEventHandler, useTx } from './useTx';
import { capitalize, chain } from './utils';

type TxResult = ContractReceipt | null;
type TxRender = TxResultRendering<TxResult>;

export interface RestoreTxProps {
  txHash: string;
}

export const useRestoreTx = () => {
  const { connection, provider, connectType, chainId } = useEvmWallet();
  const xAnchor = useEvmCrossAnchorSdk();

  const restoreTx = useCallback(
    async (
      txParams: RestoreTxProps,
      renderTxResults: Subject<TxRender>,
      handleEvent: TxEventHandler<RestoreTxProps>,
    ) => {
      try {
        const tx = await provider!.getTransaction(txParams.txHash);
        const receipt = await tx.wait();
        const result = await xAnchor.restoreTx(receipt, (event) => {
          console.log(event, 'eventEmitted ');

          renderTxResults.next(restoreTxResult(event, connectType, chainId!));
          handleEvent(event, txParams);
        });
        return result;
      } catch (error: any) {
        console.log(error);
        throw error;
      }
    },
    [xAnchor, provider, chainId, connectType],
  );

  const restoreTxStream = useTx(restoreTx, (resp) => resp, null);

  return connection && provider && connectType && chainId
    ? restoreTxStream
    : [null, null];
};

const restoreTxResult = (
  event: CrossChainEvent<ContractReceipt>,
  connnectType: ConnectType,
  chainId: EvmChainId,
) => {
  return {
    value: null,
    message: restoreTxMessage(event, connnectType, chainId),
    phase: TxStreamPhase.BROADCAST,
    receipts: [
      //{ name: "Status", value: txResultMessage(event, connnectType, chainId, action) }
    ],
  };
};

const restoreTxMessage = (
  event: CrossChainEvent<ContractReceipt>,
  connnectType: ConnectType,
  chainId: EvmChainId,
) => {
  switch (event.kind) {
    case CrossChainEventKind.RemoteChainReturnTxRequested:
      return `Deposit requested. ${capitalize(
        connnectType,
      )} notification should appear soon...`;
    case CrossChainEventKind.RemoteChainReturnTxSubmitted:
      return `Waiting for deposit transaction on ${capitalize(
        chain(chainId),
      )}...`;
  }
};
