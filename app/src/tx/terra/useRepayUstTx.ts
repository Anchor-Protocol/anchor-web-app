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
import { TerraTxProgressWriter } from 'tx/terra/TerraTxProgressWriter';
import { useRefetchQueries } from '@libs/app-provider';
import { demicrofy, formatRate, formatTokenInput } from '@libs/formatter';
import { TxInfo } from '@terra-money/terra.js';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useTerraSdk } from 'crossanchor';
import { useCallback } from 'react';
import { useRenderedTx } from './useRenderedTx';

export interface RepayUstTxParams {
  repayAmount: UST;
}

export function useRepayUstTx() {
  const connectedWallet = useConnectedWallet();
  const { txErrorReporter } = useAnchorWebapp();
  const refetchQueries = useRefetchQueries();
  const terraSdk = useTerraSdk();

  const { refetch: borrowMarketQuery } = useBorrowMarketQuery();
  const { refetch: borrowBorrowerQuery } = useBorrowBorrowerQuery();

  const sendTx = useCallback(
    async (txParams: RepayUstTxParams, writer: TerraTxProgressWriter) => {
      const result = await terraSdk.repayStable(
        formatTokenInput(txParams.repayAmount),
        connectedWallet!.walletAddress,
        {
          handleEvent: (event) => {
            writer.writeTxHash(event.payload.txHash);
          },
        },
      );

      refetchQueries(ANCHOR_TX_KEY.BORROW_REPAY);

      return result;
    },
    [connectedWallet, refetchQueries, terraSdk],
  );

  const renderResults = useCallback(
    async (txInfo: TxInfo, writer: TerraTxProgressWriter) => {
      const { data: borrowMarket } = await borrowMarketQuery();
      const { data: borrowBorrower } = await borrowBorrowerQuery();

      if (!borrowMarket || !borrowBorrower) {
        return writer.failedToCreateReceipt(
          new Error('Failed to load borrow data'),
        );
      }

      const rawLog = pickLog(txInfo, 0);

      if (!rawLog) {
        return writer.failedToFindRawLog();
      }

      const fromContract = pickEvent(rawLog, 'from_contract');

      if (!fromContract) {
        return writer.failedToFindEvents('from_contract');
      }

      try {
        const repaidAmount = pickAttributeValue<u<UST>>(fromContract, 3);

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
            repaidAmount && {
              name: 'Repaid Amount',
              value:
                formatUSTWithPostfixUnits(demicrofy(repaidAmount)) + ' UST',
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
            writer.txHashReceipt(),
            writer.txFeeReceipt(),
          ],
        } as TxResultRendering;
      } catch (error) {
        return writer.failedToParseTxResult();
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
