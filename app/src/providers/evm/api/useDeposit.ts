import { useCallback } from 'react';
// import { pipe } from '@rx-stream/pipe';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TxResultRendering, TxStreamPhase } from '@libs/app-fns';
import { useAccount } from 'contexts/account';
import { useContracts } from 'contexts/evm/contracts';
import { toWei } from './utils';

interface DepositProps {
  depositAmount: string;
  txFee: string; // TODO
}

export function useDeposit(): (
  props: DepositProps,
) => Observable<TxResultRendering> {
  const { nativeWalletAddress } = useAccount();
  const { crossAnchorBridgeContract, ustContract } = useContracts();

  return useCallback(
    ({ depositAmount }) => {
      console.log('depositAmount', depositAmount);
      crossAnchorBridgeContract
        .depositStable(ustContract.address, toWei(depositAmount), {
          from: nativeWalletAddress,
        })
        .then(({ hash }) => {
          console.log('crossAnchorBridgeContract.depositStable -> hash', hash);
        })
        .catch(console.error);

      const observable = interval(1000).pipe<TxResultRendering>(
        map((i) => {
          return {
            value: null,
            phase: TxStreamPhase.BROADCAST,
            receipts: [
              {
                name: 'Time taken',
                value: `${i} seconds`,
              },
            ],
          };
        }),
      );

      return observable;
    },
    [crossAnchorBridgeContract, nativeWalletAddress, ustContract],
  );
}
