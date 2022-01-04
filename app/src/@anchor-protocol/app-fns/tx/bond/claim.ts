import { formatUSTWithPostfixUnits } from '@anchor-protocol/notation';
import { Gas, HumanAddr, Rate, u, UST } from '@anchor-protocol/types';
import {
  pickAttributeValue,
  pickEvent,
  pickRawLog,
  TxResultRendering,
  TxStreamPhase,
} from '@libs/app-fns';
import {
  _catchTxError,
  _createTxOptions,
  _pollTxInfo,
  _postTx,
  TxHelper,
} from '@libs/app-fns/tx/internal';
import { floor } from '@libs/big-math';
import { demicrofy, stripUUSD } from '@libs/formatter';
import { QueryClient } from '@libs/query-client';
import { pipe } from '@rx-stream/pipe';
import {
  CreateTxOptions,
  Fee,
  MsgExecuteContract,
} from '@terra-money/terra.js';
import { NetworkInfo, TxResult } from '@terra-money/use-wallet';
import big, { Big } from 'big.js';
import { Observable } from 'rxjs';

export function bondClaimTx($: {
  walletAddr: HumanAddr;
  bAssetRewardAddr: HumanAddr;

  gasFee: Gas;
  gasAdjustment: Rate<number>;
  fixedGas: u<UST>;
  network: NetworkInfo;
  queryClient: QueryClient;
  post: (tx: CreateTxOptions) => Promise<TxResult>;
  txErrorReporter?: (error: unknown) => string;
  onTxSucceed?: () => void;
}): Observable<TxResultRendering> {
  const helper = new TxHelper({ ...$, txFee: $.fixedGas });

  return pipe(
    _createTxOptions({
      msgs: [
        new MsgExecuteContract($.walletAddr, $.bAssetRewardAddr, {
          // @see https://github.com/Anchor-Protocol/anchor-bAsset-contracts/blob/master/contracts/anchor_basset_reward/src/msg.rs#L46
          // @see https://github.com/Anchor-Protocol/anchor-bAsset-contracts/blob/master/contracts/anchor_basset_reward/src/user.rs#L16
          claim_rewards: {},
        }),
      ],
      fee: new Fee($.gasFee, floor($.fixedGas) + 'uusd'),
      gasAdjustment: $.gasAdjustment,
    }),
    _postTx({ helper, ...$ }),
    _pollTxInfo({ helper, ...$ }),
    ({ value: txInfo }) => {
      const rawLog = pickRawLog(txInfo, 0);

      if (!rawLog) {
        return helper.failedToFindRawLog();
      }

      const transfer = pickEvent(rawLog, 'transfer');

      if (!transfer) {
        return helper.failedToFindEvents('transfer');
      }

      try {
        const claimedReward = pickAttributeValue<string>(transfer, 5);

        const txFee = pickAttributeValue<string>(transfer, 2);

        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [
            !!claimedReward && {
              name: 'Claimed Reward',
              value:
                formatUSTWithPostfixUnits(demicrofy(stripUUSD(claimedReward))) +
                ' UST',
            },
            helper.txHashReceipt(),
            {
              name: 'Tx Fee',
              value:
                formatUSTWithPostfixUnits(
                  demicrofy(
                    big(txFee ? stripUUSD(txFee) : '0').plus($.fixedGas) as u<
                      UST<Big>
                    >,
                  ),
                ) + ' UST',
            },
          ],
        } as TxResultRendering;
      } catch (error) {
        return helper.failedToParseTxResult();
      }
    },
  )().pipe(_catchTxError({ helper, ...$ }));
}
