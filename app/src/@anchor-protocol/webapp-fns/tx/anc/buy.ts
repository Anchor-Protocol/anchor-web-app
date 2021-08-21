import { AddressProvider } from '@anchor-protocol/anchor.js';
import { validateInput } from '@anchor-protocol/anchor.js/dist/utils/validate-input';
import { validateAddress } from '@anchor-protocol/anchor.js/dist/utils/validation/address';
import {
  validateIsGreaterThanZero,
  validateIsNumber,
} from '@anchor-protocol/anchor.js/dist/utils/validation/number';
import {
  demicrofy,
  formatANCWithPostfixUnits,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { Rate, uANC, UST, uUST } from '@anchor-protocol/types';
import { pipe } from '@rx-stream/pipe';
import { floor, min } from '@packages/big-math';
import { NetworkInfo, TxResult } from '@terra-dev/wallet-types';
import {
  Coin,
  Coins,
  CreateTxOptions,
  Dec,
  Int,
  MsgExecuteContract,
  StdFee,
} from '@terra-money/terra.js';
import {
  MantleFetch,
  pickAttributeValueByKey,
  pickEvent,
  pickRawLog,
  TaxData,
  TxResultRendering,
  TxStreamPhase,
} from '@packages/webapp-fns';
import big, { Big } from 'big.js';
import { Observable } from 'rxjs';
import { _catchTxError } from '../internal/_catchTxError';
import { _createTxOptions } from '../internal/_createTxOptions';
import { _pollTxInfo } from '../internal/_pollTxInfo';
import { _postTx } from '../internal/_postTx';
import { TxHelper } from '../internal/TxHelper';

export function ancBuyTx(
  $: Parameters<typeof fabricatebBuy>[0] & {
    gasFee: uUST<number>;
    gasAdjustment: Rate<number>;
    txFee: uUST;
    fixedGas: uUST;
    tax: TaxData;
    network: NetworkInfo;
    addressProvider: AddressProvider;
    mantleEndpoint: string;
    mantleFetch: MantleFetch;
    post: (tx: CreateTxOptions) => Promise<TxResult>;
    txErrorReporter?: (error: unknown) => string;
    onTxSucceed?: () => void;
  },
): Observable<TxResultRendering> {
  const helper = new TxHelper($);

  return pipe(
    _createTxOptions({
      msgs: fabricatebBuy($)($.addressProvider),
      fee: new StdFee($.gasFee, floor($.txFee) + 'uusd'),
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
        const return_amount = pickAttributeValueByKey<uANC>(
          fromContract,
          'return_amount',
        );
        const offer_amount = pickAttributeValueByKey<uUST>(
          fromContract,
          'offer_amount',
        );
        const spread_amount = pickAttributeValueByKey<uANC>(
          fromContract,
          'spread_amount',
        );
        const commission_amount = pickAttributeValueByKey<uANC>(
          fromContract,
          'commission_amount',
        );

        const pricePerANC =
          return_amount && offer_amount
            ? (big(return_amount).div(offer_amount) as UST<Big>)
            : undefined;
        const tradingFee =
          spread_amount && commission_amount
            ? (big(spread_amount).plus(commission_amount) as uANC<Big>)
            : undefined;
        const txFee = offer_amount
          ? (big($.fixedGas).plus(
              min(big(offer_amount).mul($.tax.taxRate), $.tax.maxTaxUUSD),
            ) as uUST<Big>)
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

interface Option {
  address: string;
  amount: string;
  denom: string;
  to?: string;
  beliefPrice?: string;
  maxSpread?: string;
}

export const fabricatebBuy =
  ({ address, amount, to, beliefPrice, maxSpread, denom }: Option) =>
  (addressProvider: AddressProvider): MsgExecuteContract[] => {
    validateInput([
      validateAddress(address),
      validateIsNumber(amount),
      validateIsGreaterThanZero(+amount),
    ]);

    const coins = new Coins([
      new Coin(denom, new Int(new Dec(amount).mul(1000000)).toString()),
    ]);
    const pairAddress = addressProvider.terraswapAncUstPair();
    return [
      new MsgExecuteContract(
        address,
        pairAddress,
        {
          swap: {
            offer_asset: {
              info: {
                native_token: {
                  denom: denom,
                },
              },
              amount: new Int(new Dec(amount).mul(1000000)).toString(),
            },
            belief_price: beliefPrice,
            max_spread: maxSpread,
            to: to,
          },
        },
        coins,
      ),
    ];
  };
