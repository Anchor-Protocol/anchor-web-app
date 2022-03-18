import {
  CrossChainEvent,
  CrossChainEventKind,
} from '@anchor-protocol/crossanchor-sdk';
import { TxReceiptLike, TxResultRendering } from '@libs/app-fns';
import { EvmChainId, ConnectType } from '@libs/evm-wallet';
import { ContractReceipt } from 'ethers';
import { Subject } from 'rxjs';
import { TxProgressWriter } from './TxProgressWriter';
import { capitalize } from './utils';

const DEFAULT_STATUS = new Map<CrossChainEventKind, string>([
  [CrossChainEventKind.RemoteChainApprovalRequested, 'Approving'],
  [CrossChainEventKind.RemoteChainApprovalSubmitted, 'Approving'],
  [CrossChainEventKind.RemoteChainTxRequested, 'Pending'],
  [CrossChainEventKind.RemoteChainTxSubmitted, 'Pending'],
  [CrossChainEventKind.RemoteChainTxExecuted, 'Pending'],
  [CrossChainEventKind.RemoteChainVAAsRetrieved, 'Bridging'],
  [CrossChainEventKind.OutgoingSequenceRetrieved, 'Bridging'],
  [CrossChainEventKind.TerraVAAsRetrieved, 'Bridging'],
  [CrossChainEventKind.RemoteChainReturnTxRequested, 'Completing'],
  [CrossChainEventKind.RemoteChainReturnTxSubmitted, 'Completing'],
  [CrossChainEventKind.CrossChainTxCompleted, 'Complete'],
]);

export class EvmTxProgressWriter<
  T extends TxResultRendering,
> extends TxProgressWriter<T> {
  private readonly _chainId: EvmChainId;
  private readonly _connnectType: ConnectType;
  private readonly _description: string;

  constructor(
    subject: Subject<T>,
    chainId: EvmChainId,
    connnectType: ConnectType,
  ) {
    super(subject);
    this._chainId = chainId;
    this._connnectType = connnectType;
    this._description = `Transaction sent, please check your ${capitalize(
      connnectType,
    )} wallet for further instructions.`;
  }

  public approveCollateral(symbol: string) {
    this.write({
      message: `Approve your spend limit for ${symbol}`,
      description: this._description,
    });
  }

  public approveUST() {
    this.approveCollateral('UST');
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
        description: this._description,
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
        description: this._description,
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
        description: this._description,
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
        description: this._description,
        receipts: this.mergeEventKind(current.receipts, map, event),
      };
    });
  }

  public provideCollateral(
    symbol: string,
    event?: CrossChainEvent<ContractReceipt>,
  ) {
    const map = new Map<CrossChainEventKind, string>([
      ...DEFAULT_STATUS,
      [CrossChainEventKind.RemoteChainTxSubmitted, `Providing ${symbol}`],
      [CrossChainEventKind.RemoteChainTxExecuted, `Providing ${symbol}`],
    ]);
    this.write((current) => {
      return {
        ...current,
        message: `Providing your ${symbol}`,
        description: this._description,
        receipts: this.mergeEventKind(current.receipts, map, event),
      };
    });
  }

  public claimRewards(event?: CrossChainEvent<ContractReceipt>) {
    const map = new Map<CrossChainEventKind, string>([
      ...DEFAULT_STATUS,
      [CrossChainEventKind.RemoteChainTxSubmitted, `Claiming`],
      [CrossChainEventKind.RemoteChainTxExecuted, `Claiming`],
    ]);
    this.write((current) => {
      return {
        ...current,
        message: `Claiming rewards`,
        description: this._description,
        receipts: this.mergeEventKind(current.receipts, map, event),
      };
    });
  }

  public restoreTx(event?: CrossChainEvent<ContractReceipt>) {
    const map = new Map<CrossChainEventKind, string>([
      ...DEFAULT_STATUS,
      [CrossChainEventKind.RemoteChainReturnTxSubmitted, 'Restoring'],
      [CrossChainEventKind.RemoteChainReturnTxRequested, 'Restoring'],
    ]);
    this.write((current) => {
      return {
        ...current,
        message: 'Restoring transaction',
        description: this._description,
        receipts: this.mergeEventKind(current.receipts, map, event),
      };
    });
  }

  public withdrawCollateral(
    symbol: string,
    event?: CrossChainEvent<ContractReceipt>,
  ) {
    const map = new Map<CrossChainEventKind, string>([
      ...DEFAULT_STATUS,
      [
        CrossChainEventKind.RemoteChainReturnTxSubmitted,
        `Withdrawing ${symbol}`,
      ],
      [
        CrossChainEventKind.RemoteChainReturnTxRequested,
        `Withdrawing ${symbol}`,
      ],
    ]);
    this.write((current) => {
      return {
        ...current,
        message: `Withdrawing your ${symbol}`,
        description: this._description,
        receipts: this.mergeEventKind(current.receipts, map, event),
      };
    });
  }
}
