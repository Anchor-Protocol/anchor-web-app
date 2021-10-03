import { AddressProvider } from '@anchor-protocol/anchor.js';
import { createHookMsg } from '@anchor-protocol/anchor.js/dist/utils/cw20/create-hook-msg';
import { validateInput } from '@anchor-protocol/anchor.js/dist/utils/validate-input';
import { validateAddress } from '@anchor-protocol/anchor.js/dist/utils/validation/address';
import { formatLP } from '@anchor-protocol/notation';
import { AncUstLP, Gas, Rate, u, UST } from '@anchor-protocol/types';
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
import { demicrofy } from '@libs/formatter';
import { QueryClient } from '@libs/query-client';
import { pipe } from '@rx-stream/pipe';
import { NetworkInfo, TxResult } from '@terra-dev/wallet-types';
import {
  CreateTxOptions,
  Dec,
  Int,
  MsgExecuteContract,
  StdFee,
} from '@terra-money/terra.js';
import { Observable } from 'rxjs';

export function ancAncUstLpStakeTx(
  $: Parameters<typeof fabricateStakingBond>[0] & {
    gasFee: Gas;
    gasAdjustment: Rate<number>;
    fixedGas: u<UST>;
    network: NetworkInfo;
    addressProvider: AddressProvider;
    queryClient: QueryClient;
    post: (tx: CreateTxOptions) => Promise<TxResult>;
    txErrorReporter?: (error: unknown) => string;
    onTxSucceed?: () => void;
  },
): Observable<TxResultRendering> {
  const helper = new TxHelper({ ...$, txFee: $.fixedGas });

  return pipe(
    _createTxOptions({
      msgs: fabricateStakingBond($)($.addressProvider),
      fee: new StdFee($.gasFee, $.fixedGas + 'uusd'),
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

interface Option {
  address: string;
  amount: string;
}

export const fabricateStakingBond =
  ({ address, amount }: Option) =>
  (addressProvider: AddressProvider): MsgExecuteContract[] => {
    validateInput([validateAddress(address)]);

    const anchorToken = addressProvider.terraswapAncUstLPToken();

    return [
      new MsgExecuteContract(address, anchorToken, {
        send: {
          contract: addressProvider.staking(),
          amount: new Int(new Dec(amount).mul(1000000)).toString(),
          msg: createHookMsg({
            bond: {},
          }),
        },
      }),
    ];
  };
