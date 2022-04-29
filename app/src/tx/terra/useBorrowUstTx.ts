import {
  computeBorrowedAmount,
  computeBorrowLimit,
  computeLtv,
} from '@anchor-protocol/app-fns';
import {
  ANCHOR_TX_KEY,
  useAnchorWebapp,
  useBorrowBorrowerQuery,
  useBorrowMarketQuery,
} from '@anchor-protocol/app-provider';
import { formatUSTWithPostfixUnits } from '@anchor-protocol/notation';
import { u, UST } from '@anchor-protocol/types';
import {
  pickAttributeValue,
  pickEvent,
  TxResultRendering,
  TxStreamPhase,
} from '@libs/app-fns';
import { pickLog } from '@libs/app-fns/queries/utils';
import { TxHelper } from '@libs/app-fns/tx/internal';
import { useRefetchQueries } from '@libs/app-provider';
import { demicrofy, formatRate, formatTokenInput } from '@libs/formatter';
import { TxInfo } from '@terra-money/terra.js';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useTerraSdk } from 'crossanchor';
import { useCallback } from 'react';
import { useRenderedTx } from './useRenderedTx';

export interface BorrowUstTxParams {
  borrowAmount: UST;
}

export function useBorrowUstTx() {
  const connectedWallet = useConnectedWallet();
  const { txErrorReporter } = useAnchorWebapp();
  const refetchQueries = useRefetchQueries();
  const terraSdk = useTerraSdk();

  const { refetch: borrowMarketQuery } = useBorrowMarketQuery();
  const { refetch: borrowBorrowerQuery } = useBorrowBorrowerQuery();

  const sendTx = useCallback(
    async (txParams: BorrowUstTxParams, helper: TxHelper) => {
      const result = await terraSdk.borrowStable(
        formatTokenInput(txParams.borrowAmount),
        connectedWallet!.walletAddress,
        {
          handleEvent: (event) => {
            helper.setTxHash(event.payload.txHash);
          },
        },
      );

      refetchQueries(ANCHOR_TX_KEY.BORROW_BORROW);

      return result;
    },
    [connectedWallet, refetchQueries, terraSdk],
  );

  const renderResults = useCallback(
    async (txInfo: TxInfo, helper: TxHelper) => {
      const { data: borrowMarket } = await borrowMarketQuery();
      const { data: borrowBorrower } = await borrowBorrowerQuery();

      if (!borrowMarket || !borrowBorrower) {
        return helper.failedToCreateReceipt(
          new Error('Failed to load borrow data'),
        );
      }

      const rawLog = pickLog(txInfo, 0);

      if (!rawLog) {
        return helper.failedToFindRawLog();
      }

      const fromContract = pickEvent(rawLog, 'from_contract');

      if (!fromContract) {
        return helper.failedToFindEvents('from_contract');
      }

      try {
        const borrowedAmount = pickAttributeValue<u<UST>>(fromContract, 3);

        const ltv = computeLtv(
          computeBorrowLimit(
            borrowBorrower.overseerCollaterals,
            borrowMarket.oraclePrices,
            borrowMarket.bAssetLtvs,
          ),
          computeBorrowedAmount(borrowBorrower.marketBorrowerInfo),
        );

        const outstandingLoan = borrowBorrower.marketBorrowerInfo.loan_amount;

        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [
            borrowedAmount && {
              name: 'Borrowed Amount',
              value:
                formatUSTWithPostfixUnits(demicrofy(borrowedAmount)) + ' UST',
            },
            ltv && {
              name: 'New Borrow Usage',
              value: formatRate(ltv) + ' %',
            },
            outstandingLoan && {
              name: 'Outstanding Loan',
              value:
                formatUSTWithPostfixUnits(demicrofy(outstandingLoan)) + ' UST',
            },
            helper.txHashReceipt(),
            helper.txFeeReceipt(),
          ],
        } as TxResultRendering;
      } catch (error) {
        return helper.failedToParseTxResult();
      }
    },
    [borrowBorrowerQuery, borrowMarketQuery],
  );

  const streamReturn = useRenderedTx({
    sendTx,
    renderResults,
    network: connectedWallet!.network,
    txFee: terraSdk.globalOverrides.gasFee.toString(),
    txErrorReporter,
  });

  return connectedWallet ? streamReturn : [null, null];
}
