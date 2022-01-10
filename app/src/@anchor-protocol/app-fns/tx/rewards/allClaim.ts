import { formatANC } from '@anchor-protocol/notation';
import { ANC, CW20Addr, Gas, HumanAddr, Rate } from '@anchor-protocol/types';
import {
  pickAttributeValueByKey,
  pickEvent,
  RawLogEvent,
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
import { demicrofy } from '@libs/formatter';
import { QueryClient } from '@libs/query-client';
import { u, UST } from '@libs/types';
import { pipe } from '@rx-stream/pipe';
import {
  CreateTxOptions,
  Fee,
  MsgExecuteContract,
} from '@terra-money/terra.js';
import { NetworkInfo, TxResult } from '@terra-money/use-wallet';
import big, { Big } from 'big.js';
import { Observable } from 'rxjs';

export function rewardsAllClaimTx($: {
  walletAddr: HumanAddr;
  generatorAddr: HumanAddr;
  marketAddr: HumanAddr;
  lpTokenAddr: CW20Addr;

  claimAncUstLp: boolean;
  claimUstBorrow: boolean;
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

  if (!$.claimAncUstLp && !$.claimUstBorrow) {
    throw new Error(`There are no claimable rewards!`);
  }

  const msgs: MsgExecuteContract[] = [];

  if ($.claimAncUstLp) {
    msgs.push(
      new MsgExecuteContract($.walletAddr, $.generatorAddr, {
        withdraw: {
          lp_token: $.lpTokenAddr,
          amount: '0',
        },
      }),
    );
  }

  if ($.claimUstBorrow) {
    msgs.push(
      new MsgExecuteContract($.walletAddr, $.marketAddr, {
        claim_rewards: {},
      }),
    );
  }

  return pipe(
    _createTxOptions({
      msgs,
      fee: new Fee($.gasFee, floor($.fixedGas) + 'uusd'),
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
