import {
  CrossChainEvent,
  CrossChainEventKind,
} from '@anchor-protocol/crossanchor-sdk';
import { TxReceiptLike, TxResultRendering } from '@libs/app-fns';
import { EvmChainId, ConnectType } from '@libs/evm-wallet';
import { ContractReceipt } from 'ethers';
import { Subject } from 'rxjs';
import { TxProgressWriter } from './TxProgressWriter';

const DEFAULT_STATUS = new Map<CrossChainEventKind, string>([
  [CrossChainEventKind.RemoteChainApprovalRequested, 'Approving'],
  [CrossChainEventKind.RemoteChainApprovalSubmitted, 'Approving'],
  [CrossChainEventKind.RemoteChainTxRequested, 'Pending'],
  [CrossChainEventKind.RemoteChainTxSubmitted, 'Pending'],
  [CrossChainEventKind.RemoteChainTxExecuted, 'Pending'],
  [CrossChainEventKind.RemoteChainWormholeEntered, 'Bridging'],
  [CrossChainEventKind.TerraWormholeEntered, 'Bridging'],
  [CrossChainEventKind.TerraWormholeExited, 'Bridging'],
  [CrossChainEventKind.RemoteChainReturnTxRequested, 'Completing'],
  [CrossChainEventKind.RemoteChainReturnTxSubmitted, 'Completing'],
  [CrossChainEventKind.CrossChainTxCompleted, 'Complete'],
]);

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

  public approveUST() {
    this.write({
      message: 'Approve your spend limit',
    });
  }

  private mergeEventKind(
    source: TxReceiptLike[],
    map: Map<CrossChainEventKind, string>,
    event?: CrossChainEvent<ContractReceipt>,
  ): TxReceiptLike[] {
    const receipts = [...source];

    const index = receipts.findIndex(
      (receipt) => receipt && 'name' in receipt && receipt.name === 'Status',
    );

    receipts[index < 0 ? receipts.length : index] = {
      name: 'Status',
      value: event?.kind ? map.get(event.kind) ?? 'Pending' : 'Pending',
    };

    return receipts;
  }

  public depositUST(event?: CrossChainEvent<ContractReceipt>) {
    const map = new Map<CrossChainEventKind, string>([
      ...DEFAULT_STATUS,
      [CrossChainEventKind.RemoteChainTxSubmitted, 'Depositing'],
      [CrossChainEventKind.RemoteChainTxExecuted, 'Depositing'],
    ]);
    this.write((current) => {
      return {
        ...current,
        message: 'Depositing your UST',
        receipts: this.mergeEventKind(current.receipts, map, event),
      };
    });
  }

  public withdrawUST(event?: CrossChainEvent<ContractReceipt>) {
    const map = new Map<CrossChainEventKind, string>([
      ...DEFAULT_STATUS,
      [CrossChainEventKind.RemoteChainReturnTxSubmitted, 'Withdrawing'],
      [CrossChainEventKind.RemoteChainReturnTxRequested, 'Withdrawing'],
    ]);
    this.write((current) => {
      return {
        ...current,
        message: 'Withdrawing your UST',
        receipts: this.mergeEventKind(current.receipts, map, event),
      };
    });
  }

  public borrowUST(event?: CrossChainEvent<ContractReceipt>) {
    const map = new Map<CrossChainEventKind, string>([
      ...DEFAULT_STATUS,
      [CrossChainEventKind.RemoteChainReturnTxSubmitted, 'Borrowing'],
      [CrossChainEventKind.RemoteChainReturnTxRequested, 'Borrowing'],
    ]);
    this.write((current) => {
      return {
        ...current,
        message: 'Borrowing UST',
        receipts: this.mergeEventKind(current.receipts, map, event),
      };
    });
  }

  public repayUST(event?: CrossChainEvent<ContractReceipt>) {
    const map = new Map<CrossChainEventKind, string>([
      ...DEFAULT_STATUS,
      [CrossChainEventKind.RemoteChainTxSubmitted, 'Repaying'],
      [CrossChainEventKind.RemoteChainTxExecuted, 'Repaying'],
    ]);
    this.write((current) => {
      return {
        ...current,
        message: 'Repaying your loan',
        receipts: this.mergeEventKind(current.receipts, map, event),
      };
    });
  }
}
