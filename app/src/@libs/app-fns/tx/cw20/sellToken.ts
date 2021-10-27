import { TxResultRendering, TxStreamPhase } from '../../models/tx';
import {
  pickAttributeValueByKey,
  pickEvent,
  pickRawLog,
} from '../../queries/txInfo';
import { floor } from '@libs/big-math';
import {
  formatTokenIntegerWithPostfixUnits,
  formatUTokenIntegerWithPostfixUnits,
  stripUUSD,
} from '@libs/formatter';
import {
  cw20,
  CW20Addr,
  HumanAddr,
  Rate,
  terraswap,
  Token,
  u,
  UST,
} from '@libs/types';
import { pipe } from '@rx-stream/pipe';
import { MsgExecuteContract, Fee } from '@terra-money/terra.js';
import big, { Big } from 'big.js';
import { Observable } from 'rxjs';
import {
  _catchTxError,
  _createTxOptions,
  _pollTxInfo,
  _postTx,
  TxHelper,
} from '../internal';
import { TxCommonParams } from '../TxCommonParams';

export function cw20SellTokenTx<T extends Token>(
  $: {
    sellerAddr: HumanAddr;
    sellAmount: u<T>;
    tokenAddr: CW20Addr;
    tokenUstPairAddr: HumanAddr;
    tokenSymbol: string;
    beliefPrice: T;
    /** = slippage_tolerance */
    maxSpread: Rate;
    taxRate: Rate;
    maxTaxUUSD: u<UST>;
    onTxSucceed?: () => void;
  } & TxCommonParams,
): Observable<TxResultRendering> {
  const helper = new TxHelper($);

  return pipe(
    _createTxOptions({
      msgs: [
        new MsgExecuteContract($.sellerAddr, $.tokenAddr, {
          send: {
            contract: $.tokenUstPairAddr,
            amount: $.sellAmount,
            msg: Buffer.from(
              JSON.stringify({
                swap: {
                  belief_price: $.beliefPrice,
                  max_spread: $.maxSpread,
                },
              } as terraswap.pair.SwapHook),
            ).toString('base64'),
          },
        } as cw20.Send<T>),
      ],
      fee: new Fee($.gasWanted, floor($.txFee) + 'uusd'),
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
        // sold
        const offer_amount = pickAttributeValueByKey<u<UST>>(
          fromContract,
          'offer_amount',
        );
        // earned
        const return_amount = pickAttributeValueByKey<u<Token>>(
          fromContract,
          'return_amount',
        );
        const spread_amount = pickAttributeValueByKey<u<UST>>(
          fromContract,
          'spread_amount',
        );
        const commission_amount = pickAttributeValueByKey<u<UST>>(
          fromContract,
          'commission_amount',
        );
        const transfer_amount = stripUUSD(
          pickAttributeValueByKey<u<UST>>(
            transfer,
            'amount',
            (attrs) => attrs[0],
          ) ?? '0uusd',
        );

        const pricePerToken =
          return_amount && offer_amount
            ? (big(return_amount).div(offer_amount) as UST<Big>)
            : undefined;
        const tradingFee =
          spread_amount && commission_amount
            ? (big(spread_amount).plus(commission_amount) as u<UST<Big>>)
            : undefined;
        const txFee = big($.fixedFee).plus(transfer_amount) as u<UST<Big>>;

        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [
            offer_amount && {
              name: 'Sold',
              value: `${formatUTokenIntegerWithPostfixUnits(offer_amount)} ${
                $.tokenSymbol
              }`,
            },
            return_amount && {
              name: 'Earned',
              value: `${formatUTokenIntegerWithPostfixUnits(
                return_amount,
              )} UST`,
            },
            pricePerToken && {
              name: `Price per ${$.tokenSymbol}`,
              value: `${formatTokenIntegerWithPostfixUnits(pricePerToken)} UST`,
            },
            tradingFee && {
              name: 'Trading Fee',
              value: `${formatUTokenIntegerWithPostfixUnits(tradingFee)} UST`,
            },
            helper.txHashReceipt(),
            helper.txFeeReceipt(txFee),
          ],
        } as TxResultRendering;
      } catch (error) {
        return helper.failedToParseTxResult();
      }
    },
  )().pipe(_catchTxError({ helper, ...$ }));
}
