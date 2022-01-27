import { ANC, Gas, HumanAddr, Rate, u, UST } from '@anchor-protocol/types';
import { TxResultRendering, TxStreamPhase } from '@libs/app-fns';
import {
  _catchTxError,
  _createTxOptions,
  _pollTxInfo,
  _postTx,
  TxHelper,
} from '@libs/app-fns/tx/internal';
import { floor } from '@libs/big-math';
import { formatTokenInput } from '@libs/formatter';
import { QueryClient } from '@libs/query-client';
import { pipe } from '@rx-stream/pipe';
import {
  CreateTxOptions,
  Fee,
  MsgExecuteContract,
} from '@terra-money/terra.js';
import { NetworkInfo, TxResult } from '@terra-money/use-wallet';
import { Observable } from 'rxjs';

export function govVoteTx($: {
  walletAddr: HumanAddr;
  govAddr: HumanAddr;
  amount: ANC;
  voteFor: 'yes' | 'no';
  pollId: number;

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
        new MsgExecuteContract($.walletAddr, $.govAddr, {
          cast_vote: {
            poll_id: $.pollId,
            vote: $.voteFor,
            amount: formatTokenInput($.amount),
          },
        }),
      ],
      fee: new Fee($.gasFee, floor($.fixedGas) + 'uusd'),
      gasAdjustment: $.gasAdjustment,
    }),
    _postTx({ helper, ...$ }),
    _pollTxInfo({ helper, ...$ }),
    () => {
      try {
        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [helper.txHashReceipt()],
        } as TxResultRendering;
      } catch (error) {
        return helper.failedToParseTxResult();
      }
    },
  )().pipe(_catchTxError({ helper, ...$ }));
}
