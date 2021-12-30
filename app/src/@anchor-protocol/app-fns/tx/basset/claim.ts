import { AddressProvider } from '@anchor-protocol/anchor.js';
import { validateInput } from '@anchor-protocol/anchor.js/dist/utils/validate-input';
import { validateAddress } from '@anchor-protocol/anchor.js/dist/utils/validation/address';
import { formatUSTWithPostfixUnits } from '@anchor-protocol/notation';
import { Gas, HumanAddr, Rate, u, UST } from '@anchor-protocol/types';
import {
  pickAttributeValue,
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
import { floor } from '@libs/big-math';
import { demicrofy, stripUUSD } from '@libs/formatter';
import { QueryClient } from '@libs/query-client';
import { pipe } from '@rx-stream/pipe';
import {
  CreateTxOptions,
  Fee,
  MsgExecuteContract,
} from '@terra-money/terra.js';
import { NetworkInfo, TxResult } from '@terra-money/use-wallet';
import big, { Big } from 'big.js';
import { Observable } from 'rxjs';

export function bAssetClaimTx(
  $: Parameters<typeof fabricatebAssetClaimRewards>[0] & {
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
      msgs: fabricatebAssetClaimRewards($)($.addressProvider),
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

      const transfer = pickEvent(rawLog, 'transfer');

      if (!transfer) {
        return helper.failedToFindEvents('transfer');
      }

      // https://finder.terra.money/bombay-12/tx/343E30771368EBB96CAE04E8260EF0E96949D2569DDAA3356B2C09AB75B65F73

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
  rewardAddrs: HumanAddr[];
}

export const fabricatebAssetClaimRewards =
  ({ address, rewardAddrs }: Option) =>
  (addressProvider: AddressProvider) => {
    validateInput([validateAddress(address)]);

    return rewardAddrs.map((rewardAddr) => {
      return new MsgExecuteContract(address, rewardAddr, {
        claim_rewards: {
          recipient: undefined,
        },
      });
    });
  };
