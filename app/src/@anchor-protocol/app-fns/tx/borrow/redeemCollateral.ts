import {
  computeBorrowedAmount,
  computeBorrowLimit,
  computeLtv,
} from '@anchor-protocol/app-fns';
import {
  formatInput,
  formatOutput,
  microfy,
  demicrofy,
} from '@anchor-protocol/formatter';
import {
  bAsset,
  bLuna,
  Gas,
  HumanAddr,
  Rate,
  u,
  UST,
} from '@anchor-protocol/types';
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
import { formatRate } from '@libs/formatter';
import { QueryClient } from '@libs/query-client';
import { pipe } from '@rx-stream/pipe';
import {
  CreateTxOptions,
  Fee,
  MsgExecuteContract,
} from '@terra-money/terra.js';
import { NetworkInfo, TxResult } from '@terra-money/wallet-provider';
import { WhitelistCollateral } from 'queries';
import { QueryObserverResult } from 'react-query';
import { Observable } from 'rxjs';
import { BorrowBorrower } from '../../queries/borrow/borrower';
import { BorrowMarket } from '../../queries/borrow/market';
import { _fetchBorrowData } from './_fetchBorrowData';

export function borrowRedeemCollateralTx($: {
  collateral: WhitelistCollateral;
  walletAddr: HumanAddr;
  redeemAmount: bAsset;
  overseerAddr: HumanAddr;
  gasFee: Gas;
  gasAdjustment: Rate<number>;
  fixedGas: u<UST>;
  network: NetworkInfo;
  queryClient: QueryClient;
  post: (tx: CreateTxOptions) => Promise<TxResult>;
  txErrorReporter?: (error: unknown) => string;
  borrowMarketQuery: () => Promise<
    QueryObserverResult<BorrowMarket | undefined>
  >;
  borrowBorrowerQuery: () => Promise<
    QueryObserverResult<BorrowBorrower | undefined>
  >;
  onTxSucceed?: () => void;
}): Observable<TxResultRendering> {
  const helper = new TxHelper({ ...$, txFee: $.fixedGas });

  return pipe(
    _createTxOptions({
      msgs: [
        // unlock collateral
        new MsgExecuteContract($.walletAddr, $.overseerAddr, {
          // @see https://github.com/Anchor-Protocol/money-market-contracts/blob/master/contracts/overseer/src/msg.rs#L78
          unlock_collateral: {
            collaterals: [
              [
                $.collateral.collateral_token,
                formatInput(
                  microfy($.redeemAmount, $.collateral.decimals),
                  $.collateral.decimals,
                ),
              ],
            ],
          },
        }),

        // withdraw from custody
        new MsgExecuteContract($.walletAddr, $.collateral.custody_contract, {
          // @see https://github.com/Anchor-Protocol/money-market-contracts/blob/master/contracts/custody/src/msg.rs#L69
          withdraw_collateral: {
            amount: formatInput(
              microfy($.redeemAmount, $.collateral.decimals),
              $.collateral.decimals,
            ),
          },
        }),
      ],
      fee: new Fee($.gasFee, floor($.fixedGas) + 'uusd'),
      gasAdjustment: $.gasAdjustment,
    }),
    _postTx({ helper, ...$ }),
    _pollTxInfo({ helper, ...$ }),
    _fetchBorrowData({ helper, ...$ }),
    ({ value: { txInfo, borrowMarket, borrowBorrower } }) => {
      if (!borrowMarket || !borrowBorrower) {
        return helper.failedToCreateReceipt(
          new Error('Failed to load borrow data'),
        );
      }

      const rawLog = pickRawLog(txInfo, 1);

      if (!rawLog) {
        return helper.failedToFindRawLog();
      }

      const fromContract = pickEvent(rawLog, 'from_contract');

      if (!fromContract) {
        return helper.failedToFindEvents('from_contract');
      }

      try {
        const redeemedAmount = pickAttributeValue<u<bLuna>>(fromContract, 16);

        const ltv = computeLtv(
          computeBorrowLimit(
            borrowBorrower.overseerCollaterals,
            borrowMarket.oraclePrices,
            borrowMarket.bAssetLtvs,
          ),
          computeBorrowedAmount(borrowBorrower.marketBorrowerInfo),
        );

        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [
            redeemedAmount && {
              name: 'Redeemed Amount',
              value: `${formatOutput(
                demicrofy(redeemedAmount, $.collateral.decimals),
                { decimals: $.collateral.decimals },
              )} ${$.collateral.symbol}`,
            },
            ltv && {
              name: 'New Borrow Usage',
              value: formatRate(ltv) + ' %',
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
