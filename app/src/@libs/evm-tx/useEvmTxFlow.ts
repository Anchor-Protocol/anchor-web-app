import { useCallback, useRef } from 'react';
import { Observable, OperatorFunction, catchError } from 'rxjs';
import { useStream, StreamResult } from '@rx-stream/react';
import { pipe } from '@rx-stream/pipe';
import { UserDenied } from '@terra-money/use-wallet';
import { ContractTransaction } from '@ethersproject/contracts';
import { TxResultRendering, TxStreamPhase } from '@libs/app-fns';
import { useEvmWallet } from '@libs/evm-wallet';
import { useAccount } from 'contexts/account';
import { EvmTxCommonProps } from './types';
import { getTxHashReceipt } from './utils';

interface EvmTx<T> {
  (props: T): Promise<ContractTransaction>;
}

type UseEvmTxFlowReturnType<T> =
  | [(props: T) => Observable<TxResultRendering>, StreamResult<any>]
  | [null, null];

export function useEvmTxFlow<T extends EvmTxCommonProps | undefined>(
  evmTx: EvmTx<T>,
): UseEvmTxFlowReturnType<T> {
  const { chainId, connected } = useAccount();
  const { provider } = useEvmWallet();
  const txHash = useRef<string>();

  const callback = useCallback(
    (props) =>
      // @ts-ignore TODO
      pipe(
        () =>
          ({
            value: null,
            phase: TxStreamPhase.POST,
            receipts: [],
          } as TxResultRendering),
        () =>
          evmTx(props)
            .then(({ hash }) => {
              txHash.current = hash;

              return {
                value: null,
                phase: TxStreamPhase.BROADCAST,
                receipts: [],
              };
            })
            .catch((error) => {
              throw error.code === 4001 ? new UserDenied() : error;
            }),
        () =>
          new Promise((resolve, reject) => {
            if (!provider || !txHash.current) {
              return reject(new Error('Wallet is not connected'));
            }

            provider
              .waitForTransaction(txHash.current)
              .then((receipt) => {
                console.log('ustContract.approve -> receipt', receipt);
                resolve({
                  value: null,
                  phase: TxStreamPhase.SUCCEED,
                  receipts: [
                    // TODO: just for example
                    // burned && {
                    //   name: 'Burned',
                    //   value: formatLP(demicrofy(burned)) + ' ANC-UST LP',
                    // },
                    // receivedAnc &&
                    // receivedUst && {
                    //   name: 'Received',
                    //   value:
                    //     formatANCWithPostfixUnits(demicrofy(receivedAnc)) +
                    //     ' ANC + ' +
                    //     formatUSTWithPostfixUnits(demicrofy(receivedUst)) +
                    //     ' UST',
                    // },
                    // helper.txFeeReceipt(txFee ? txFee : undefined),
                    getTxHashReceipt(txHash.current, chainId),
                  ],
                });

                props?.onTxSucceed?.();
              })
              .catch(reject);
          }),
      )().pipe(catchTxError([getTxHashReceipt(txHash.current, chainId)])),
    [chainId, evmTx, provider],
  );

  const streamReturn = useStream(callback);

  return connected ? streamReturn : [null, null];
}

function catchTxError(
  receipts: TxResultRendering['receipts'],
): OperatorFunction<any, any> {
  return catchError((error) =>
    Promise.resolve<TxResultRendering>({
      receipts,
      value: null,
      phase: TxStreamPhase.FAILED,
      failedReason: {
        error: error?.message || error,
        errorId: error?.code,
      },
    }),
  );
}
