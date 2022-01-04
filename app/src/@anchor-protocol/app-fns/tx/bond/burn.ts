import { formatLuna } from '@anchor-protocol/notation';
import {
  bLuna,
  CW20Addr,
  Gas,
  HumanAddr,
  Luna,
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
import {
  demicrofy,
  formatFluidDecimalPoints,
  formatTokenInput,
} from '@libs/formatter';
import { QueryClient } from '@libs/query-client';
import { pipe } from '@rx-stream/pipe';
import {
  CreateTxOptions,
  Fee,
  MsgExecuteContract,
} from '@terra-money/terra.js';
import { NetworkInfo, TxResult } from '@terra-money/use-wallet';
import big, { BigSource } from 'big.js';
import { Observable } from 'rxjs';

export function bondBurnTx($: {
  walletAddr: HumanAddr;
  bAssetTokenAddr: CW20Addr;
  bAssetHubAddr: HumanAddr;
  burnAmount: bLuna;

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
        new MsgExecuteContract($.walletAddr, $.bAssetTokenAddr, {
          // @see https://github.com/Anchor-Protocol/anchor-bAsset-contracts/blob/cce41e707c67ee2852c4929e17fb1472dbd2aa35/contracts/anchor_basset_token/src/handler.rs#L101
          send: {
            contract: $.bAssetHubAddr,
            amount: formatTokenInput($.burnAmount),
            msg: createHookMsg({
              unbond: {},
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
        const burnedAmount = pickAttributeValueByKey<u<Luna>>(
          fromContract,
          'amount',
          (attrs) => attrs[0],
        );
        const expectedAmount = pickAttributeValueByKey<u<bLuna>>(
          fromContract,
          'amount',
          (attrs) => attrs.reverse()[0],
        );

        const exchangeRate =
          burnedAmount &&
          expectedAmount &&
          (big(expectedAmount).div(burnedAmount) as
            | Rate<BigSource>
            | undefined);

        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [
            burnedAmount && {
              name: 'Burned Amount',
              value: formatLuna(demicrofy(burnedAmount)) + ' bLUNA',
            },
            expectedAmount && {
              name: 'Expected Amount',
              value: formatLuna(demicrofy(expectedAmount)) + ' LUNA',
            },
            exchangeRate && {
              name: 'Exchange Rate',
              value: formatFluidDecimalPoints(exchangeRate, 6),
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
