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
  CW20Addr,
  Gas,
  HumanAddr,
  Rate,
  u,
  UST,
} from '@anchor-protocol/types';
import {
  CW20TokenDisplayInfo,
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
  createHookMsg,
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
import { NetworkInfo, TxResult } from '@terra-money/use-wallet';
import { QueryObserverResult } from 'react-query';
import { Observable } from 'rxjs';
import { BorrowBorrower } from '../../queries/borrow/borrower';
import { BorrowMarket } from '../../queries/borrow/market';
import { _fetchBorrowData } from './_fetchBorrowData';

export function borrowProvideCollateralTx($: {
  tokenDisplay?: CW20TokenDisplayInfo;
  walletAddr: HumanAddr;
  depositAmount: bAsset;
  overseerAddr: HumanAddr;
  bAssetTokenAddr: CW20Addr;
  bAssetCustodyAddr: HumanAddr;
  bAssetSymbol: string;
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
  const collateralDecimals = $.tokenDisplay?.decimals ?? 6;

  return pipe(
    _createTxOptions({
      msgs: [
        // provide_collateral call
        new MsgExecuteContract($.walletAddr, $.bAssetTokenAddr, {
          send: {
            contract: $.bAssetCustodyAddr,
            amount: formatInput(
              microfy($.depositAmount, collateralDecimals),
              collateralDecimals,
            ),
            msg: createHookMsg({
              deposit_collateral: {},
            }),
          },
        }),
        // lock_collateral call
        new MsgExecuteContract($.walletAddr, $.overseerAddr, {
          // @see https://github.com/Anchor-Protocol/money-market-contracts/blob/master/contracts/overseer/src/msg.rs#L75
          lock_collateral: {
            collaterals: [
              [
                $.bAssetTokenAddr,
                formatInput(
                  microfy($.depositAmount, collateralDecimals),
                  collateralDecimals,
                ),
              ],
            ],
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
        const collateralizedAmount = pickAttributeValue<u<bLuna>>(
          fromContract,
          7,
        );

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
            collateralizedAmount && {
              name: 'Collateralized Amount',
              value: `${formatOutput(
                demicrofy(collateralizedAmount, collateralDecimals),
                { decimals: collateralDecimals },
              )} ${$.bAssetSymbol}`,
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
