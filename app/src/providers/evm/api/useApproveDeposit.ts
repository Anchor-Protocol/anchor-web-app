import { useCallback } from 'react';
import { interval, Observable } from 'rxjs';
// import { pipe } from '@rx-stream/pipe';
import { MaxUint256 } from '@ethersproject/constants';
import { TxResultRendering, TxStreamPhase } from '@libs/app-fns';
import { useEvmWallet } from '@libs/evm-wallet';
import { useAccount } from 'contexts/account';
import { useContracts } from 'contexts/evm/contracts';
import { map } from 'rxjs/operators';

export function useApproveDeposit(): () => Observable<TxResultRendering> {
  const { nativeWalletAddress } = useAccount();
  const { crossAnchorBridgeContract, ustContract } = useContracts();
  const { provider } = useEvmWallet();

  return useCallback(() => {
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

    ustContract
      .approve(crossAnchorBridgeContract.address, MaxUint256.toString(), {
        from: nativeWalletAddress,
      })
      .then(({ hash }) => {
        console.log('ustContract.approve -> hash', hash);
        // TODO: move provider to Account
        provider!.waitForTransaction(hash).then((receipt) => {
          console.log('ustContract.approve -> receipt', receipt);
        });
      })
      .catch((error) => {
        if (error.code !== 4001) {
          console.error(error);
        }
      });

    return observable;

    // const observable = pipe<void, TxResultRendering>(() => {
    //   return {
    //     value: null,
    //     phase: TxStreamPhase.SUCCEED,
    //     receipts: [
    //       {
    //         name: 'Withdraw Amount',
    //         value: '100.50 UST',
    //       },
    //     ],
    //   };
    // });
    //
    // return observable();
  }, [
    crossAnchorBridgeContract.address,
    nativeWalletAddress,
    provider,
    ustContract,
  ]);
}
