import { CrossChainEvent } from '@anchor-protocol/crossanchor-sdk';
import { TxResultRendering } from '@libs/app-fns';
import { EvmChainId, ConnectType } from '@libs/evm-wallet';
import { ContractReceipt } from 'ethers';
import { Subject } from 'rxjs';
import { TxProgressWriter } from './TxProgressWriter';

// RemoteChainTxRequested = 0,
// RemoteChainTxSubmitted = 1,
// RemoteChainTxExecuted = 2,
// RemoteChainWormholeEntered = 3,
// RemoteChainApprovalRequested = 4,
// RemoteChainApprovalSubmitted = 5,
// TerraWormholeEntered = 6,
// TerraWormholeExited = 7,
// CrossChainTxCompleted = 8,
// RemoteChainReturnTxSubmitted = 9,
// RemoteChainReturnTxRequested = 10

// const XANCHOR_STATUS = {
//   [CrossChainEventKind.RemoteChainReturnTxRequested]: 'Pending',
//   [CrossChainEventKind.RemoteChainTxSubmitted]: 'Depositing',
//   [CrossChainEventKind.RemoteChainTxExecuted]: 'Depositing',
//   [CrossChainEventKind.RemoteChainWormholeEntered]: 'Bridging',
//   [CrossChainEventKind.RemoteChainApprovalRequested]: 'Pending',
//   [CrossChainEventKind.RemoteChainApprovalSubmitted]: 'Pending',
//   [CrossChainEventKind.TerraWormholeEntered]: 'Bridging',
//   [CrossChainEventKind.TerraWormholeExited]: 'Bridging',
//   [CrossChainEventKind.CrossChainTxCompleted]: 'Complete',
//   [CrossChainEventKind.RemoteChainReturnTxSubmitted]: 'Completing',
//   [CrossChainEventKind.RemoteChainReturnTxRequested]: 'Completing',
// }

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
  }

  // 0, 1, 2, 3, 7, 10, 9, 8

  public writeDeposit(event?: CrossChainEvent<ContractReceipt>) {
    this.write((current) => {
      const receipts = [
        ...current.receipts,
        // event &&
        //   event?.payload?.tx && {
        //     name: 'Tx Hash',
        //     value: truncateEvm(event.payload.tx.transactionHash),
        //   },
      ];

      const index = receipts.findIndex(
        (receipt) => receipt && 'name' in receipt && receipt.name === 'Status',
      );

      receipts[index < 0 ? receipts.length : index] = {
        name: 'Status',
        //value: XANCHOR_STATUS[event.kind as CrossChainEventKind]
        value: '0',
      };

      return {
        ...current,
        message: 'Depositing your UST',
        receipts,
      };
    });
  }
}
