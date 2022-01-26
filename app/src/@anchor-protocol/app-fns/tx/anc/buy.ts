import {
  formatANCWithPostfixUnits,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import {
  ANC,
  Gas,
  HumanAddr,
  Rate,
  terraswap,
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
  TxHelper,
} from '@libs/app-fns/tx/internal';
import { floor, min } from '@libs/big-math';
import { demicrofy, formatTokenInput } from '@libs/formatter';
import { QueryClient } from '@libs/query-client';
import { pipe } from '@rx-stream/pipe';
import {
  Coin,
  Coins,
  CreateTxOptions,
  Fee,
  MsgExecuteContract,
} from '@terra-money/terra.js';
import { NetworkInfo, TxResult } from '@terra-money/use-wallet';
import big, { Big } from 'big.js';
import { Observable } from 'rxjs';
import { AnchorTax } from '../../types';

export function ancBuyTx($: {
  fromAmount: UST;
  maxSpread: Rate;
  beliefPrice: UST;
  walletAddr: HumanAddr;
  ancUstPairAddr: HumanAddr;

  gasFee: Gas;
  gasAdjustment: Rate<number>;
  txFee: u<UST>;
  fixedGas: u<UST>;
  tax: AnchorTax;
  network: NetworkInfo;
  queryClient: QueryClient;
  post: (tx: CreateTxOptions) => Promise<TxResult>;
  txErrorReporter?: (error: unknown) => string;
  onTxSucceed?: () => void;
}): Observable<TxResultRendering> {
  const helper = new TxHelper($);

  return pipe(
    _createTxOptions({
      msgs: [
        new MsgExecuteContract(
          $.walletAddr,
          $.ancUstPairAddr,
          {
            swap: {
              offer_asset: {
                info: {
                  native_token: {
                    denom: 'uusd',
                  },
                },
                amount: formatTokenInput($.fromAmount) as u<UST>,
              },
              belief_price: $.beliefPrice,
              max_spread: $.maxSpread,
            },
          } as terraswap.pair.Swap<UST>,
          new Coins([new Coin('uusd', formatTokenInput($.fromAmount))]),
        ),
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

      try {
        const return_amount = pickAttributeValueByKey<u<ANC>>(
          fromContract,
          'return_amount',
        );
        const offer_amount = pickAttributeValueByKey<u<UST>>(
          fromContract,
          'offer_amount',
        );
        const spread_amount = pickAttributeValueByKey<u<ANC>>(
          fromContract,
          'spread_amount',
        );
        const commission_amount = pickAttributeValueByKey<u<ANC>>(
          fromContract,
          'commission_amount',
        );

        const pricePerANC =
          return_amount && offer_amount
            ? (big(return_amount).div(offer_amount) as UST<Big>)
            : undefined;
        const tradingFee =
          spread_amount && commission_amount
            ? (big(spread_amount).plus(commission_amount) as u<ANC<Big>>)
            : undefined;
        const txFee = offer_amount
          ? (big($.fixedGas).plus(
              min(big(offer_amount).mul($.tax.taxRate), $.tax.maxTaxUUSD),
            ) as u<UST<Big>>)
          : undefined;

        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [
            return_amount && {
              name: 'Bought',
              value:
                formatANCWithPostfixUnits(demicrofy(return_amount)) + ' ANC',
            },
            offer_amount && {
              name: 'Paid',
              value:
                formatUSTWithPostfixUnits(demicrofy(offer_amount)) + ' UST',
            },
            pricePerANC && {
              name: 'Paid/Bought',
              value: formatUSTWithPostfixUnits(pricePerANC) + ' UST',
            },
            tradingFee && {
              name: 'Trading Fee',
              value: formatANCWithPostfixUnits(demicrofy(tradingFee)) + ' ANC',
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
