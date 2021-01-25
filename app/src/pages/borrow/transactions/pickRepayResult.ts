import {
  demicrofy,
  formatRatioToPercentage,
  formatUSTWithPostfixUnits,
  uUST,
} from '@anchor-protocol/notation';
import { TxInfoParseError } from 'errors/TxInfoParseError';
import { TransactionResult } from 'models/transaction';
import { currentLtv } from 'pages/borrow/logics/currentLtv';
import { Data as MarketBalance } from 'pages/borrow/queries/marketBalanceOverview';
import { Data as MarketOverview } from 'pages/borrow/queries/marketOverview';
import { Data as MarketUserOverview } from 'pages/borrow/queries/marketUserOverview';
import {
  Data,
  pickAttributeValue,
  pickEvent,
  pickRawLog,
} from 'queries/txInfos';
import { pickTxFee, TxResult } from 'transactions/tx';

interface Params {
  txResult: TxResult;
  txInfo: Data;
  marketBalance: MarketBalance;
  marketOverview: MarketOverview;
  marketUserOverview: MarketUserOverview;
}

export function pickRepayResult({
  txInfo,
  txResult,
  marketOverview,
  marketUserOverview,
}: Params): TransactionResult {
  const rawLog = pickRawLog(txInfo, 0);

  if (!rawLog) {
    throw new TxInfoParseError(txResult, txInfo, 'Undefined the RawLog');
  }

  const fromContract = pickEvent(rawLog, 'from_contract');

  if (!fromContract) {
    throw new TxInfoParseError(
      txResult,
      txInfo,
      'Undefined the from_contract event',
    );
  }

  const repaidAmount = pickAttributeValue<uUST>(fromContract, 3);

  const newLtv = currentLtv(
    marketUserOverview.loanAmount.loan_amount,
    marketUserOverview.borrowInfo.balance,
    marketUserOverview.borrowInfo.spendable,
    marketOverview.oraclePrice.rate,
  );

  const outstandingLoan = marketUserOverview.loanAmount.loan_amount;

  const txFee = pickTxFee(txResult);

  const txHash = txResult.result.txhash;

  return {
    txInfo,
    txResult,
    txFee,
    txHash,
    details: [
      repaidAmount && {
        name: 'Borrowed Amount',
        value: formatUSTWithPostfixUnits(demicrofy(repaidAmount)) + ' UST',
      },
      newLtv && {
        name: 'New LTV',
        value: formatRatioToPercentage(newLtv) + ' %',
      },
      outstandingLoan && {
        name: 'Outstanding Loan',
        value: formatUSTWithPostfixUnits(demicrofy(outstandingLoan)) + ' UST',
      },
    ],
  };
}
