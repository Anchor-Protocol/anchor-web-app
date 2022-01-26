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
import { demicrofy, formatTokenInput, stripUUSD } from '@libs/formatter';
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
import { AncPrice } from '../../queries/anc/price';
import { AnchorTax } from '../../types';

export function ancAncUstLpProvideTx($: {
  walletAddr: HumanAddr;
  ancUstPairAddr: HumanAddr;
  ancTokenAddr: CW20Addr;
  ancAmount: ANC;
  ustAmount: UST;
  slippageTolerance?: Rate;

  ancPrice: AncPrice | undefined;
  tax: AnchorTax;
  gasFee: Gas;
  gasAdjustment: Rate<number>;
  txFee: u<UST>;
  fixedGas: u<UST>;
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
        new MsgExecuteContract($.walletAddr, $.ancTokenAddr, {
          increase_allowance: {
            spender: $.ancUstPairAddr,
            amount: formatTokenInput($.ancAmount),
            expires: { never: {} },
          },
        } as cw20.IncreaseAllowance),
        new MsgExecuteContract(
          $.walletAddr,
          $.ancUstPairAddr,
          {
            provide_liquidity: {
              assets: [
                {
                  info: {
                    token: {
                      contract_addr: $.ancTokenAddr,
                    },
                  },
                  amount: formatTokenInput($.ancAmount),
                },
                {
                  info: {
                    native_token: {
                      denom: 'uusd',
                    },
                  },
                  amount: formatTokenInput($.ustAmount),
                },
              ],
              slippage_tolerance: $.slippageTolerance,
            },
          } as terraswap.pair.ProvideLiquidity<ANC, UST>,
          new Coins([new Coin('uusd', formatTokenInput($.ustAmount))]),
        ),
      ],
      fee: new Fee($.gasFee, floor($.txFee) + 'uusd'),
      gasAdjustment: $.gasAdjustment,
    }),
    _postTx({ helper, ...$ }),
    _pollTxInfo({ helper, ...$ }),
    ({ value: txInfo }) => {
      const rawLog = pickRawLog(txInfo, 1);

      if (!rawLog) {
        return helper.failedToFindRawLog();
      }

      const fromContract = pickEvent(rawLog, 'from_contract');
      const transfer = pickEvent(rawLog, 'transfer');

      if (!fromContract || !transfer) {
        return helper.failedToFindEvents('from_contract', 'transfer');
      }

      try {
        const depositedAnc = pickAttributeValueByKey<u<ANC>>(
          fromContract,
          'amount',
        );

        const depositedUusd = pickAttributeValueByKey<string>(
          transfer,
          'amount',
        );

        const depositedUst = depositedUusd && stripUUSD(depositedUusd);

        const received = pickAttributeValueByKey<u<AncUstLP>>(
          fromContract,
          'share',
        );

        const simulatedUst =
          !!depositedAnc &&
          !!depositedUst &&
          !!$.ancPrice &&
          (big(big(depositedAnc).mul($.ancPrice.ANCPrice)).plus(
            depositedUst,
          ) as u<UST<Big>>);

        const txFee =
          simulatedUst &&
          (big($.fixedGas).plus(
            min(simulatedUst.mul($.tax.taxRate), $.tax.maxTaxUUSD),
          ) as u<UST<Big>>);

        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [
            received && {
              name: 'Received',
              value: formatLP(demicrofy(received)) + ' ANC-UST LP',
            },
            !!depositedAnc &&
              !!depositedUst && {
                name: 'Deposited',
                value:
                  formatANCWithPostfixUnits(demicrofy(depositedAnc)) +
                  ' ANC + ' +
                  formatUSTWithPostfixUnits(demicrofy(depositedUst)) +
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
