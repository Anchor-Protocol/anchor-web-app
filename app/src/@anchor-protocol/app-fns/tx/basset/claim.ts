import { formatUSTWithPostfixUnits } from '@anchor-protocol/notation';
import { Gas, HumanAddr, Rate, u, UST } from '@anchor-protocol/types';
import {
  pickAttributeValueByKey,
  pickEvent,
  pickRawLogs,
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
import { demicrofy } from '@libs/formatter';
import { QueryClient } from '@libs/query-client';
import { pipe } from '@rx-stream/pipe';
import {
  CreateTxOptions,
  Dec,
  Fee,
  MsgExecuteContract,
} from '@terra-money/terra.js';
import { NetworkInfo, TxResult } from '@terra-money/use-wallet';
import { Observable } from 'rxjs';

export function bAssetClaimTx($: {
  walletAddr: HumanAddr;
  rewardAddrs: HumanAddr[];

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
      msgs: $.rewardAddrs.map((rewardAddr) => {
        return new MsgExecuteContract($.walletAddr, rewardAddr, {
          claim_rewards: {
            recipient: undefined,
          },
        });
      }),
      fee: new Fee($.gasFee, floor($.fixedGas) + 'uusd'),
      gasAdjustment: $.gasAdjustment,
    }),
    _postTx({ helper, ...$ }),
    _pollTxInfo({ helper, ...$ }),
    ({ value: txInfo }) => {
      const rawLogs = pickRawLogs(txInfo);

      // for now just aggregate the total rewards, but we can split
      // these in the receipts if we can map the contract addresses
      const total = rawLogs.reduce((previous, current) => {
        const wasm = pickEvent(current, 'wasm');
        if (wasm) {
          const rewards = pickAttributeValueByKey<string>(wasm, 'rewards');
          if (rewards) {
            return previous.add(rewards);
          }
        }
        return previous;
      }, new Dec(0));

      // const rawLog = pickRawLog(txInfo, 0);

      // if (!rawLog) {
      //   return helper.failedToFindRawLog();
      // }

      // const wasm = pickEvent(rawLog, 'wasm');

      // if (!wasm) {
      //   return helper.failedToFindEvents('wasm');
      // }

      try {
        return {
          value: null,
          phase: TxStreamPhase.SUCCEED,
          receipts: [
            total && {
              name: 'Claimed Rewards',
              value:
                formatUSTWithPostfixUnits(
                  demicrofy(total.toString() as u<UST>),
                ) + ' UST',
            },
            helper.txHashReceipt(),
            helper.txFeeReceipt(),
          ],
        } as TxResultRendering;
      } catch (error) {
        return helper.failedToParseTxResult();
      }
    },
  )().pipe(_catchTxError({ helper, ...$ }));
}
