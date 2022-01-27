import { formatLP } from '@anchor-protocol/notation';
import {
  AncUstLP,
  CW20Addr,
  Gas,
  HumanAddr,
  Rate,
  u,
  UST,
} from '@anchor-protocol/types';
import {
  pickAttributeValueByKey,
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
  createHookMsg,
  TxHelper,
} from '@libs/app-fns/tx/internal';
import { floor } from '@libs/big-math';
import { demicrofy, formatTokenInput } from '@libs/formatter';
import { QueryClient } from '@libs/query-client';
import { pipe } from '@rx-stream/pipe';
import {
  CreateTxOptions,
  Fee,
  MsgExecuteContract,
} from '@terra-money/terra.js';
import { NetworkInfo, TxResult } from '@terra-money/use-wallet';
import { Observable } from 'rxjs';

export function ancAncUstLpStakeTx($: {
  walletAddr: HumanAddr;
  generatorAddr: HumanAddr;
  ancUstLpTokenAddr: CW20Addr;
  lpAmount: AncUstLP;

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
        new MsgExecuteContract($.walletAddr, $.ancUstLpTokenAddr, {
          send: {
            contract: $.generatorAddr,
            amount: formatTokenInput($.lpAmount),
            msg: createHookMsg({
              deposit: {},
            }),
          },
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

      const fromContract = pickEvent(rawLog, 'from_contract');

      if (!fromContract) {
        return helper.failedToFindEvents('from_contract');
      }

      try {
        const amount = pickAttributeValueByKey<u<AncUstLP>>(
          fromContract,
          'amount',
        );

        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [
            amount && {
              name: 'Amount',
              value: formatLP(demicrofy(amount)) + ' ANC-UST LP',
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
