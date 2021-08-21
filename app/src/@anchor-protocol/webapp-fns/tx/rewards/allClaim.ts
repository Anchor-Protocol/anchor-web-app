import {
  AddressProvider,
  fabricateMarketClaimRewards,
  fabricateStakingWithdraw,
  MARKET_DENOMS,
} from '@anchor-protocol/anchor.js';
import { demicrofy, formatLP } from '@anchor-protocol/notation';
import { HumanAddr, Rate, uANC, uUST } from '@anchor-protocol/types';
import { pipe } from '@rx-stream/pipe';
import { NetworkInfo, TxResult } from '@terra-dev/wallet-types';
import {
  CreateTxOptions,
  MsgExecuteContract,
  StdFee,
} from '@terra-money/terra.js';
import {
  MantleFetch,
  pickAttributeValueByKey,
  pickEvent,
  RawLogEvent,
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

export function rewardsAllClaimTx($: {
  address: HumanAddr;
  claimAncUstLp: boolean;
  claimUstBorrow: boolean;
  gasFee: uUST<number>;
  gasAdjustment: Rate<number>;
  fixedGas: uUST;
  network: NetworkInfo;
  addressProvider: AddressProvider;
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  post: (tx: CreateTxOptions) => Promise<TxResult>;
  txErrorReporter?: (error: unknown) => string;
  onTxSucceed?: () => void;
}): Observable<TxResultRendering> {
  const helper = new TxHelper({ ...$, txFee: $.fixedGas });

  if (!$.claimAncUstLp && !$.claimUstBorrow) {
    throw new Error(`There are no claimable rewards!`);
  }

  const msgs: MsgExecuteContract[] = [];

  if ($.claimAncUstLp) {
    msgs.push(
      ...fabricateStakingWithdraw({ address: $.address })($.addressProvider),
    );
  }

  if ($.claimUstBorrow) {
    msgs.push(
      ...fabricateMarketClaimRewards({
        address: $.address,
        market: MARKET_DENOMS.UUSD,
      })($.addressProvider),
    );
  }

  return pipe(
    _createTxOptions({
      msgs,
      fee: new StdFee($.gasFee, $.fixedGas + 'uusd'),
      gasAdjustment: $.gasAdjustment,
    }),
    _postTx({ helper, ...$ }),
    _pollTxInfo({ helper, ...$ }),
    ({ value: txInfo }) => {
      const fromContracts = txInfo.reduce((fromContracts, { RawLog }) => {
        if (RawLog) {
          for (const rawLog of RawLog) {
            if (typeof rawLog !== 'string') {
              const fromContract = pickEvent(rawLog, 'from_contract');
              if (fromContract) {
                fromContracts.push(fromContract);
              }
            }
          }
        }
        return fromContracts;
      }, [] as RawLogEvent[]);

      if (fromContracts.length === 0) {
        return helper.failedToFindEvents('from_contract');
      }

      try {
        const claimed = fromContracts.reduce((claimed, fromContract) => {
          const amount = pickAttributeValueByKey<uANC>(
            fromContract,
            'amount',
            (attrs) => attrs.reverse()[0],
          );
          return amount ? claimed.plus(amount) : claimed;
        }, big(0)) as uANC<Big>;

        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [
            claimed && {
              name: 'Claimed',
              value: formatLP(demicrofy(claimed)) + ' ANC',
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
