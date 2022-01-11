import {
  formatANCWithPostfixUnits,
  formatLP,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import {
  ANC,
  AncUstLP,
  cw20,
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
import { demicrofy, formatTokenInput, stripUUSD } from '@libs/formatter';
import { QueryClient } from '@libs/query-client';
import { pipe } from '@rx-stream/pipe';
import {
  CreateTxOptions,
  Fee,
  MsgExecuteContract,
} from '@terra-money/terra.js';
import { NetworkInfo, TxResult } from '@terra-money/use-wallet';
import { Observable } from 'rxjs';

export function ancAncUstLpWithdrawTx($: {
  walletAddr: HumanAddr;
  lpAmount: AncUstLP;
  ancUstLpTokenAddr: CW20Addr;
  ancUstPairAddr: HumanAddr;

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
            contract: $.ancUstPairAddr,
            amount: formatTokenInput($.lpAmount),
            msg: createHookMsg({
              withdraw_liquidity: {},
            }),
          },
        } as cw20.Send<AncUstLP>),
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
      const transfer = pickEvent(rawLog, 'transfer');

      if (!fromContract || !transfer) {
        return helper.failedToFindEvents('from_contract', 'transfer');
      }

      try {
        const burned = pickAttributeValueByKey<u<AncUstLP>>(
          fromContract,
          'withdrawn_share',
        );

        const receivedAnc = pickAttributeValueByKey<u<ANC>>(
          fromContract,
          'amount',
          (attrs) => attrs.reverse()[1],
        );
        const receivedUusd = pickAttributeValueByKey<string>(
          transfer,
          'amount',
          (attrs) => attrs.reverse()[0],
        );
        const receivedUst = !!receivedUusd && stripUUSD(receivedUusd);

        //const transferAmount = pickAttributeValueByKey<string>(
        //  transfer,
        //  'amount',
        //);
        //const transferFee = transferAmount && stripUUSD(transferAmount);

        const txFee = undefined;
        //!!transferFee && (big($.fixedGas).plus(transferFee) as u<UST<Big>>);

        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [
            burned && {
              name: 'Burned',
              value: formatLP(demicrofy(burned)) + ' ANC-UST LP',
            },
            receivedAnc &&
              receivedUst && {
                name: 'Received',
                value:
                  formatANCWithPostfixUnits(demicrofy(receivedAnc)) +
                  ' ANC + ' +
                  formatUSTWithPostfixUnits(demicrofy(receivedUst)) +
                  ' UST',
              },
            helper.txHashReceipt(),
            helper.txFeeReceipt(txFee ? txFee : undefined),
          ],
        } as TxResultRendering;
      } catch (error) {
        return helper.failedToParseTxResult();
      }
    },
  )().pipe(_catchTxError({ helper, ...$ }));
}
