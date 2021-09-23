import {
  AddressProvider,
  fabricateMarketClaimRewards,
  fabricateStakingWithdraw,
  MARKET_DENOMS,
} from '@anchor-protocol/anchor.js';
import { formatANC } from '@anchor-protocol/notation';
import { ANC, Gas, HumanAddr, Rate } from '@anchor-protocol/types';
import { demicrofy } from '@libs/formatter';
import { MantleFetch } from '@libs/mantle';
import { u, UST } from '@libs/types';
import {
  pickAttributeValueByKey,
  pickEvent,
  RawLogEvent,
  TxResultRendering,
  TxStreamPhase,
} from '@libs/webapp-fns';
import {
  _catchTxError,
  _createTxOptions,
  _pollTxInfo,
  _postTx,
  TxHelper,
} from '@libs/webapp-fns/tx/internal';
import { pipe } from '@rx-stream/pipe';
import { NetworkInfo, TxResult } from '@terra-dev/wallet-types';
import {
  CreateTxOptions,
  MsgExecuteContract,
  StdFee,
} from '@terra-money/terra.js';
import big, { Big } from 'big.js';
import { Observable } from 'rxjs';

export function rewardsAllClaimTx($: {
  address: HumanAddr;
  claimAncUstLp: boolean;
  claimUstBorrow: boolean;
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
          const amount = pickAttributeValueByKey<u<ANC>>(
            fromContract,
            'amount',
            (attrs) => attrs.reverse()[0],
          );
          return amount ? claimed.plus(amount) : claimed;
        }, big(0)) as u<ANC<Big>>;

        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [
            claimed && {
              name: 'Claimed',
              value: formatANC(demicrofy(claimed)) + ' ANC',
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
