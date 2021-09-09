import { AddressProvider, COLLATERAL_DENOMS } from '@anchor-protocol/anchor.js';
import { validateInput } from '@anchor-protocol/anchor.js/dist/utils/validate-input';
import { validateAddress } from '@anchor-protocol/anchor.js/dist/utils/validation/address';
import { formatUSTWithPostfixUnits } from '@anchor-protocol/notation';
import { Gas, Rate, u, UST } from '@anchor-protocol/types';
import { demicrofy, stripUUSD } from '@libs/formatter';
import { MantleFetch } from '@libs/mantle';
import {
  pickAttributeValue,
  pickEvent,
  pickRawLog,
  TxResultRendering,
  TxStreamPhase,
} from '@libs/webapp-fns';
import { pipe } from '@rx-stream/pipe';
import { NetworkInfo, TxResult } from '@terra-dev/wallet-types';
import {
  CreateTxOptions,
  MsgExecuteContract,
  StdFee,
} from '@terra-money/terra.js';
import big, { Big } from 'big.js';
import { Observable } from 'rxjs';
import {
  TxHelper,
  _postTx,
  _pollTxInfo,
  _createTxOptions,
  _catchTxError,
} from '@libs/webapp-fns/tx/internal';

export function bondClaimTx(
  $: Parameters<typeof fabricatebAssetClaimRewards>[0] & {
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
      msgs: fabricatebAssetClaimRewards($)($.addressProvider),
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

      const transfer = pickEvent(rawLog, 'transfer');

      if (!transfer) {
        return helper.failedToFindEvents('transfer');
      }

      try {
        const claimedReward = pickAttributeValue<string>(transfer, 5);

        const txFee = pickAttributeValue<string>(transfer, 2);

        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [
            !!claimedReward && {
              name: 'Claimed Reward',
              value:
                formatUSTWithPostfixUnits(demicrofy(stripUUSD(claimedReward))) +
                ' UST',
            },
            helper.txHashReceipt(),
            {
              name: 'Tx Fee',
              value:
                formatUSTWithPostfixUnits(
                  demicrofy(
                    big(txFee ? stripUUSD(txFee) : '0').plus($.fixedGas) as u<
                      UST<Big>
                    >,
                  ),
                ) + ' UST',
            },
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
  recipient?: string;
  rewardDenom: COLLATERAL_DENOMS;
}

export const fabricatebAssetClaimRewards =
  ({ address, recipient, rewardDenom }: Option) =>
  (addressProvider: AddressProvider) => {
    validateInput([validateAddress(address)]);

    const rewardAddress =
      rewardDenom === COLLATERAL_DENOMS.UBETH
        ? addressProvider.bEthReward()
        : addressProvider.bLunaReward();

    return [
      new MsgExecuteContract(address, rewardAddress, {
        claim_rewards: {
          recipient, // always
        },
      }),
    ];
  };
