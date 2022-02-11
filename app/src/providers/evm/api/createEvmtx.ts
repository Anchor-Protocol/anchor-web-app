import { CrossAnchorTx } from '@anchor-protocol/cross-anchor';
import { TxResultRendering, TxStreamPhase } from '@libs/app-fns';
import { truncateEvm } from '@libs/formatter';

export const createEvmTx =
  () => (_: void | TxResultRendering<CrossAnchorTx>) => {
    // this method is used to either create the transaction, or it can be passed the
    // tx as a parameter and returns the starting point of the observation

    const txHash =
      '0x8ad143b5bee3ac2a1578032cdcdc4beb65588ced58b6483728156c9443c704d1';
    return {
      value: {
        txHash,
        chainId: 123,
      },
      phase: TxStreamPhase.BROADCAST,
      receipts: [
        {
          name: `Tx Hash`,
          value: truncateEvm(txHash),
        },
      ],
    };
  };
