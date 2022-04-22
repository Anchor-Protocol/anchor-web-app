import { ContractReceipt } from 'ethers';
import { Observable, Subject } from 'rxjs';
import {
  CrossChainEvent,
  CrossChainEventHandler,
} from '@anchor-protocol/crossanchor-sdk';

export type CreateTxResult<TxParams, TxResult> = {
  tx: (txParams: TxParams) => Promise<TxResult>;
  txEvents: Observable<CrossChainEvent<ContractReceipt>>;
};

export const createTx = <TxParams, TxResult>(
  sendTx: (
    txParams: TxParams,
    handleEvent: CrossChainEventHandler<ContractReceipt>,
  ) => Promise<TxResult>,
): CreateTxResult<TxParams, TxResult> => {
  const txEvents = new Subject<CrossChainEvent<ContractReceipt>>();

  const handleEvent = (event: CrossChainEvent<ContractReceipt>) => {
    txEvents.next(event);
  };

  const txCallback = async (txParams: TxParams) => {
    const result = await sendTx(txParams, handleEvent);

    return result;
  };

  const result = { tx: txCallback, txEvents } as CreateTxResult<
    TxParams,
    TxResult
  >;

  return result;
};
