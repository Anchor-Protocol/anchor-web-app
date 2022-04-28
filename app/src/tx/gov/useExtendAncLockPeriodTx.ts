import { useAccount } from 'contexts/account';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { ANCHOR_TX_KEY, useAnchorWebapp } from '@anchor-protocol/app-provider';
import { useFixedFee, useRefetchQueries } from '@libs/app-provider';
import { useCallback } from 'react';
import { useStream } from '@rx-stream/react';
import {
  _catchTxError,
  _createTxOptions,
  _pollTxInfo,
  _postTx,
  TxHelper,
} from '@libs/app-fns/tx/internal';
import { pipe } from '@rx-stream/pipe';
import { Fee, MsgExecuteContract } from '@terra-money/terra.js';
import {
  pickEvent,
  TxResultRendering,
  TxStreamPhase,
  pickRawLog,
} from '@libs/app-fns';
import { Second } from '@anchor-protocol/types';
import { floor } from '@libs/big-math';

export interface LockAncTxParams {
  period: Second;

  onTxSucceed?: () => void;
}

export function useExtendAncLockPeriodTx() {
  const { availablePost, connected, terraWalletAddress } = useAccount();

  const connectedWallet = useConnectedWallet();

  const { queryClient, txErrorReporter, contractAddress, constants } =
    useAnchorWebapp();

  const fixedFee = useFixedFee();

  const refetchQueries = useRefetchQueries();

  const govContract = contractAddress.anchorToken.gov;

  const stream = useCallback(
    ({ period, onTxSucceed }: LockAncTxParams) => {
      if (
        !availablePost ||
        !connected ||
        !connectedWallet ||
        !terraWalletAddress
      ) {
        throw new Error('Can not post!');
      }

      const helper = new TxHelper({
        network: connectedWallet.network,
        txFee: fixedFee,
      });

      return pipe(
        _createTxOptions({
          msgs: [
            new MsgExecuteContract(terraWalletAddress, govContract, {
              extend_lock_time: {
                time: period,
              },
            }),
          ],
          fee: new Fee(constants.gasWanted, floor(fixedFee) + 'uusd'),
          gasAdjustment: constants.gasAdjustment,
        }),
        _postTx({ helper, post: connectedWallet.post }),
        _pollTxInfo({
          helper,
          queryClient,
          onTxSucceed: () => {
            onTxSucceed?.();
            refetchQueries(ANCHOR_TX_KEY.EXTEND_LOCK_PERIOD);
          },
        }),
        ({ value: txInfo }) => {
          const rawLog = pickRawLog(txInfo, 0);

          if (!rawLog) {
            return helper.failedToFindRawLog();
          }

          const fromContract = pickEvent(rawLog, 'from_contract');

          if (!fromContract) {
            return helper.failedToFindEvents('from_contract');
          }

          try {
            return {
              value: null,

              phase: TxStreamPhase.SUCCEED,
              receipts: [helper.txHashReceipt(), helper.txFeeReceipt()],
            } as TxResultRendering;
          } catch (error) {
            return helper.failedToParseTxResult();
          }
        },
      )().pipe(_catchTxError({ helper, txErrorReporter }));
    },
    [
      availablePost,
      connected,
      connectedWallet,
      constants.gasAdjustment,
      constants.gasWanted,
      fixedFee,
      govContract,
      queryClient,
      refetchQueries,
      terraWalletAddress,
      txErrorReporter,
    ],
  );

  const streamReturn = useStream(stream);

  return connectedWallet ? streamReturn : [null, null];
}
