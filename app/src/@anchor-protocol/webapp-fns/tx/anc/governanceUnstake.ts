import { AddressProvider } from '@anchor-protocol/anchor.js';
import { validateInput } from '@anchor-protocol/anchor.js/dist/utils/validate-input';
import { validateAddress } from '@anchor-protocol/anchor.js/dist/utils/validation/address';
import { formatANCWithPostfixUnits } from '@anchor-protocol/notation';
import { ANC, Gas, Rate, u, UST } from '@anchor-protocol/types';
import { demicrofy } from '@libs/formatter';
import { MantleFetch } from '@libs/mantle';
import {
  pickAttributeValueByKey,
  pickEvent,
  pickRawLog,
  TxResultRendering,
  TxStreamPhase,
} from '@libs/webapp-fns';
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
import {
  TxHelper,
  _postTx,
  _pollTxInfo,
  _createTxOptions,
  _catchTxError,
} from '@libs/webapp-fns/tx/internal';

export function ancGovernanceUnstakeTx(
  $: Parameters<typeof fabricateGovWithdrawVotingTokens>[0] & {
    gasFee: Gas;
    gasAdjustment: Rate<number>;
    fixedGas: u<UST>;
    network: NetworkInfo;
    addressProvider: AddressProvider;
    mantleEndpoint: string;
    mantleFetch: MantleFetch;
    post: (tx: CreateTxOptions) => Promise<TxResult>;
    txErrorReporter?: (error: unknown) => string;
    onTxSucceed?: () => void;
  },
): Observable<TxResultRendering> {
  const helper = new TxHelper({ ...$, txFee: $.fixedGas });

  return pipe(
    _createTxOptions({
      msgs: fabricateGovWithdrawVotingTokens($)($.addressProvider),
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
        const amount = pickAttributeValueByKey<u<ANC>>(fromContract, 'amount');

        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [
            amount && {
              name: 'Amount',
              value: formatANCWithPostfixUnits(demicrofy(amount)) + ' ANC',
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
  amount?: string;
}

export const fabricateGovWithdrawVotingTokens =
  ({ address, amount }: Option) =>
  (addressProvider: AddressProvider): MsgExecuteContract[] => {
    validateInput([validateAddress(address)]);

    const gov = addressProvider.gov();

    return [
      new MsgExecuteContract(address, gov, {
        withdraw_voting_tokens: {
          amount: amount
            ? new Int(new Dec(amount).mul(1000000)).toString()
            : undefined,
        },
      }),
    ];
  };
