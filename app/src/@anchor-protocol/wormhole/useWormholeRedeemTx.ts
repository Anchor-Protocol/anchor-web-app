import { redeemOnEth } from '@certusone/wormhole-sdk';
import { VoidSigner } from '@ethersproject/abstract-signer';
import { TxResultRendering, TxStreamPhase } from '@libs/app-fns';
import { useEvmWallet } from '@libs/evm-wallet';
import { truncateEvm } from '@libs/formatter';
import { StreamReturn, useStream } from '@rx-stream/react';
import { useAccount } from 'contexts/account';
import { Observable } from 'rxjs';

const useWormholeRedeemTx = ():
  | StreamReturn<Uint8Array, TxResultRendering>
  | [null, null] => {
  const { connected } = useAccount();

  const { provider, address } = useEvmWallet();

  // TODO: grab from global settings somewhere
  const tokenBridgeAddress = '0xF174F9A837536C449321df1Ca093Bb96948D5386';

  const streamReturn = useStream((vaaBytes: Uint8Array) => {
    return new Observable<TxResultRendering>((subscriber) => {
      subscriber.next({
        value: undefined,
        phase: TxStreamPhase.BROADCAST,
        receipts: [],
      });

      if (address) {
        const signer = provider
          ? provider.getSigner()
          : new VoidSigner(address);

        redeemOnEth(tokenBridgeAddress, signer, vaaBytes)
          .then((receipt) => {
            console.log('redeemOnEth', 1);
            subscriber.next({
              value: undefined,
              phase: TxStreamPhase.SUCCEED,
              receipts: [
                {
                  name: 'Tx Hash',
                  value: truncateEvm(receipt.transactionHash),
                },
              ],
            });
            subscriber.complete();
          })
          .catch((error) => {
            const hasCompleted =
              error.error?.message?.indexOf('transfer already completed') > -1;

            subscriber.next({
              value: undefined,
              phase: TxStreamPhase.FAILED,
              failedReason: {
                error: hasCompleted
                  ? 'The transfer has already completed.'
                  : 'An unknown error has occured.',
              },
              receipts: [],
            });

            subscriber.complete();
          });
      }
    });
  });

  return connected ? streamReturn : [null, null];
};

export { useWormholeRedeemTx };
