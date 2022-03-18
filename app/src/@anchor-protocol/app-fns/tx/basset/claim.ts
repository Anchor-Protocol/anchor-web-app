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
import { RewardBreakdown } from 'pages/basset/hooks/useRewardsBreakdown';
import { Observable } from 'rxjs';

type RewardLogWithDisplay = {
  rewards: string;
  contract: string;
  symbol: string;
};

export function bAssetClaimTx($: {
  walletAddr: HumanAddr;
  rewardBreakdowns: RewardBreakdown[];
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
      msgs: $.rewardBreakdowns.map((rewardBreakdown) => {
        return new MsgExecuteContract(
          $.walletAddr,
          rewardBreakdown.rewardAddr,
          {
            claim_rewards: {
              recipient: undefined,
            },
          },
        );
      }),
      fee: new Fee($.gasFee, floor($.fixedGas) + 'uusd'),
      gasAdjustment: $.gasAdjustment,
    }),
    _postTx({ helper, ...$ }),
    _pollTxInfo({ helper, ...$ }),
    ({ value: txInfo }) => {
      const rawLogs = pickRawLogs(txInfo);

      const rewardBreakdownByRewardContract = $.rewardBreakdowns.reduce(
        (acc, curr) => ({ ...acc, [curr.rewardAddr]: curr }),
        {} as { [k: string]: RewardBreakdown },
      );

      const rewardLogsWithDisplay = rawLogs.reduce((acc, curr) => {
        const wasm = pickEvent(curr, 'wasm');
        if (wasm) {
          const rewards = pickAttributeValueByKey<string>(wasm, 'rewards');
          const contract = pickAttributeValueByKey<string>(
            wasm,
            'contract_address',
          );

          if (rewards && contract) {
            return [
              ...acc,
              {
                rewards,
                contract,
                symbol: rewardBreakdownByRewardContract[contract].symbol,
              },
            ];
          }
        }

        return acc;
      }, [] as RewardLogWithDisplay[]);

      const total = rewardLogsWithDisplay.reduce(
        (acc, curr) => acc.add(curr.rewards),
        new Dec(0),
      );

      try {
        return {
          value: null,
          phase: TxStreamPhase.SUCCEED,
          receipts: [
            ...rewardLogsWithDisplay.map((rewardLog) => ({
              name: `${rewardLog.symbol ?? '???'} Reward`,
              value:
                formatUSTWithPostfixUnits(
                  demicrofy(rewardLog.rewards as u<UST>),
                ) + ' UST',
            })),
            total && {
              name: 'Total Rewards',
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
