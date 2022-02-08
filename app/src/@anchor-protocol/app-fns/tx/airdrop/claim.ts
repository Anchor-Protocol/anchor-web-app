import { ANC, Gas, HumanAddr, Rate, u, UST } from '@anchor-protocol/types';
import {
  pickAttributeValueByKey,
  pickEvent,
  pickRawLog,
  TxResultRendering,
  TxStreamPhase,
} from '@libs/app-fns';
import big, { Big } from 'big.js';
import {
  _catchTxError,
  _createTxOptions,
  _pollTxInfo,
  _postTx,
  TxHelper,
} from '@libs/app-fns/tx/internal';
import { floor } from '@libs/big-math';
import { QueryClient } from '@libs/query-client';
import { pipe } from '@rx-stream/pipe';
import { NetworkInfo, TxResult } from '@terra-money/use-wallet';
import {
  CreateTxOptions,
  Fee,
  MsgExecuteContract,
} from '@terra-money/terra.js';
import { Observable } from 'rxjs';
import { airdropStageCache } from '../../caches/airdropStage';
import { Airdrop } from '../../queries/airdrop/check';
import { formatANC } from '@anchor-protocol/notation';
import { demicrofy } from '@libs/formatter';

export function airdropClaimTx($: {
  airdrop: Airdrop;
  walletAddress: HumanAddr;
  airdropContract: HumanAddr;
  gasFee: Gas;
  gasAdjustment: Rate<number>;
  txFee: u<UST>;
  network: NetworkInfo;
  queryClient: QueryClient;
  post: (tx: CreateTxOptions) => Promise<TxResult>;
  txErrorReporter?: (error: unknown) => string;
  onTxSucceed?: () => void;
}): Observable<TxResultRendering> {
  // FIXME remove hard coding (moved to src/webapp-fns/env.ts)
  //const gasFee = $.gasFee ?? 300000;
  //const txFee = $.txFee ?? ('127000' as u<UST>);

  const helper = new TxHelper({ ...$ });

  return pipe(
    _createTxOptions({
      msgs: [
        new MsgExecuteContract($.walletAddress, $.airdropContract, {
          claim: {
            stage: $.airdrop.stage,
            amount: $.airdrop.amount.toString(),
            proof: JSON.parse($.airdrop.proof),
          },
        }),
      ],
      fee: new Fee($.gasFee, floor($.txFee) + 'uusd'),
      gasAdjustment: $.gasAdjustment,
    }),
    _postTx({ helper, ...$ }),
    _pollTxInfo({ helper, ...$ }),
    ({ value: txInfo }) => {
      const rawLog = pickRawLog(txInfo, 0);

      if (!rawLog) {
        return helper.failedToFindRawLog();
      }

      const fromContract = pickEvent(rawLog, 'from_contract');

      if (!fromContract) {
        return helper.failedToFindEvents('from_contract');
      }

      const claimedAmount = pickAttributeValueByKey<u<ANC>>(
        fromContract,
        'amount',
      );
      const spreadAmount = pickAttributeValueByKey<u<ANC>>(
        fromContract,
        'spread_amount',
      );
      const commissionAmount = pickAttributeValueByKey<u<ANC>>(
        fromContract,
        'commission_amount',
      );
      const tradingFee =
        commissionAmount &&
        spreadAmount &&
        (big(commissionAmount).plus(spreadAmount) as u<ANC<Big>>);

      try {
        // FIXME cache claimed stages
        const claimedStages = airdropStageCache.get($.walletAddress) ?? [];
        airdropStageCache.set($.walletAddress, [
          ...claimedStages,
          $.airdrop.stage,
        ]);

        return {
          value: null,
          phase: TxStreamPhase.SUCCEED,
          receipts: [
            claimedAmount && {
              name: 'Claimed amount',
              value: `${formatANC(demicrofy(claimedAmount))} ANC`,
            },
            helper.txHashReceipt(),
            tradingFee && {
              name: 'Trading Fee',
              value: `${formatANC(demicrofy(tradingFee))} ANC`,
            },
            helper.txFeeReceipt(),
          ],
        } as TxResultRendering;
      } catch (error) {
        return helper.failedToParseTxResult();
      }
    },
  )().pipe(_catchTxError({ helper, ...$ }));
}
