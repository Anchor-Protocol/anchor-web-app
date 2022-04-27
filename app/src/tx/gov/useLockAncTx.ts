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
  createHookMsg,
  TxHelper,
} from '@libs/app-fns/tx/internal';
import { pipe } from '@rx-stream/pipe';
import { Fee, MsgExecuteContract } from '@terra-money/terra.js';
import {
  pickAttributeValueByKey,
  pickEvent,
  TxResultRendering,
  TxStreamPhase,
  pickRawLog,
} from '@libs/app-fns';
import { formatTokenInput, demicrofy } from '@libs/formatter';
import { ANC, cw20, u } from '@anchor-protocol/types';
import { floor } from '@libs/big-math';
import { formatANCWithPostfixUnits } from '@anchor-protocol/notation';

export interface LockAncTxParams {
  amount: ANC;
  period?: number;

  onTxSucceed?: () => void;
}

export function useLockAncTx() {
  const { availablePost, connected, terraWalletAddress } = useAccount();

  const connectedWallet = useConnectedWallet();

  const { queryClient, txErrorReporter, contractAddress, constants } =
    useAnchorWebapp();

  const fixedFee = useFixedFee();

  const refetchQueries = useRefetchQueries();

  const stream = useCallback(
    ({ amount, period, onTxSucceed }: LockAncTxParams) => {
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
            new MsgExecuteContract(
              terraWalletAddress,
              contractAddress.cw20.ANC,
              {
                send: {
                  contract: contractAddress.anchorToken.gov,
                  amount: formatTokenInput(amount),
                  msg: createHookMsg({
                    stake_voting_tokens: {},
                  }),
                },
              } as cw20.Send<ANC>,
            ),
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
            refetchQueries(ANCHOR_TX_KEY.LOCK_ANC);
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
            const amount = pickAttributeValueByKey<u<ANC>>(
              fromContract,
              'amount',
            );

            return {
              value: null,

              phase: TxStreamPhase.SUCCEED,
              receipts: [
                amount && {
                  name: 'Amount',
                  value: formatANCWithPostfixUnits(demicrofy(amount)) + ' ANC',
                },
                helper.txHashReceipt(),
                helper.txFeeReceipt(),
              ],
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
      terraWalletAddress,
      constants.gasAdjustment,
      constants.gasWanted,
      contractAddress.anchorToken.gov,
      contractAddress.cw20.ANC,
      fixedFee,
      queryClient,
      refetchQueries,
      txErrorReporter,
    ],
  );

  const streamReturn = useStream(stream);

  return connectedWallet ? streamReturn : [null, null];
}
