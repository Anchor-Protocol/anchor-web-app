import {
  CrossChainEvent,
  CrossChainEventKind,
  EvmChainId,
} from '@anchor-protocol/crossanchor-sdk';
import { TxReceiptLike, TxResultRendering } from '@libs/app-fns';
import { ConnectType } from '@libs/evm-wallet';
import { ContractReceipt } from 'ethers';
import { Subject } from 'rxjs';
import { TxProgressWriter } from './TxProgressWriter';
import { capitalize } from './utils';

const DEFAULT_STATUS = new Map<CrossChainEventKind, string>([
  [CrossChainEventKind.IncomingTxRequested, 'Pending'],
  [CrossChainEventKind.IncomingTxSubmitted, 'Pending'],
  [CrossChainEventKind.IncomingTxExecuted, 'Pending'],
  [CrossChainEventKind.IncomingVAAsRetrieved, 'Bridging'],
  [CrossChainEventKind.OutgoingSequenceRetrieved, 'Bridging'],
  [CrossChainEventKind.OutgoingVAAsRetrieved, 'Bridging'],
  [CrossChainEventKind.OutgoingTxRequested, 'Completing'],
  [CrossChainEventKind.OutgoingTxSubmitted, 'Completing'],
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
      receipts: [
        {
          name: 'Status',
          value: 'Approving',
        },
      ],
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
      [CrossChainEventKind.IncomingTxSubmitted, 'Depositing'],
      [CrossChainEventKind.IncomingTxExecuted, 'Depositing'],
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
      [CrossChainEventKind.OutgoingTxSubmitted, 'Withdrawing'],
      [CrossChainEventKind.OutgoingTxRequested, 'Withdrawing'],
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
      [CrossChainEventKind.OutgoingTxSubmitted, 'Borrowing'],
      [CrossChainEventKind.OutgoingTxRequested, 'Borrowing'],
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
      [CrossChainEventKind.IncomingTxSubmitted, 'Repaying'],
      [CrossChainEventKind.IncomingTxExecuted, 'Repaying'],
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
      [CrossChainEventKind.IncomingTxSubmitted, `Providing ${symbol}`],
      [CrossChainEventKind.IncomingTxExecuted, `Providing ${symbol}`],
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
      [CrossChainEventKind.IncomingTxSubmitted, `Claiming`],
      [CrossChainEventKind.IncomingTxExecuted, `Claiming`],
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
      [CrossChainEventKind.OutgoingTxSubmitted, 'Restoring'],
      [CrossChainEventKind.OutgoingTxRequested, 'Restoring'],
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
      [CrossChainEventKind.OutgoingTxSubmitted, `Withdrawing ${symbol}`],
      [CrossChainEventKind.OutgoingTxRequested, `Withdrawing ${symbol}`],
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
