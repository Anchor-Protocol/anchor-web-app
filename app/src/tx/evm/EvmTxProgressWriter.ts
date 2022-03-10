import { CrossChainEvent } from '@anchor-protocol/crossanchor-sdk';
import { TxResultRendering } from '@libs/app-fns';
import { EvmChainId, ConnectType } from '@libs/evm-wallet';
import { truncateEvm } from '@libs/formatter';
import { ContractReceipt } from 'ethers';
import { Subject } from 'rxjs';
import { TxProgressWriter } from './TxProgressWriter';

export class EvmTxProgressWriter<
  T extends TxResultRendering,
> extends TxProgressWriter<T> {
  private readonly _chainId: EvmChainId;
  private readonly _connnectType: ConnectType;

  constructor(
    subject: Subject<T>,
    chainId: EvmChainId,
    connnectType: ConnectType,
  ) {
    super(subject);
    this._chainId = chainId;
    this._connnectType = connnectType;
  }

  public writeApproval() {
    this.write({
      message: 'Approve your spend limit',
    });
    this.timer.reset();
  }

  public writeDeposit(event?: CrossChainEvent<ContractReceipt>) {
    console.log('event', event);
    this.write({
      message: 'Depositing your UST',
      receipts: [
        event &&
          event?.payload?.tx && {
            name: 'Tx Hash',
            value: truncateEvm(event.payload.tx.transactionHash),
          },
        { name: 'Status', value: event?.kind ?? 'Pending' },
      ],
    });
    this.timer.reset();
  }
}
