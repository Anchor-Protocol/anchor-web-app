import {
  demicrofy,
  formatRateToPercentage,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { moneyMarket, Rate, uUST } from '@anchor-protocol/types';
import { TxHashLink } from '@anchor-protocol/web-contexts/components/TxHashLink';
import { TxInfoParseError } from '@anchor-protocol/web-contexts/errors/TxInfoParseError';
import { TransactionResult } from '@anchor-protocol/web-contexts/models/transaction';
import { currentLtv } from 'pages/borrow/logics/currentLtv';
import {
  Data,
  pickAttributeValue,
  pickEvent,
  pickRawLog,
} from '@anchor-protocol/web-contexts/queries/txInfos';
import { createElement } from 'react';
import { TxResult } from '@anchor-protocol/web-contexts/transactions/tx';

interface Params {
  txResult: TxResult;
  txInfo: Data;
  txFee: uUST;
  loanAmount?: moneyMarket.market.BorrowInfoResponse;
  borrowInfo?: moneyMarket.custody.BorrowerResponse;
  oraclePrice?: moneyMarket.oracle.PriceResponse;
}

export function pickRepayResult({
  txInfo,
  txResult,
  txFee,
  loanAmount,
  borrowInfo,
  oraclePrice,
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

  const newLtv =
    loanAmount && borrowInfo && oraclePrice
      ? currentLtv(loanAmount, borrowInfo, oraclePrice)
      : ('0' as Rate);

  const outstandingLoan = loanAmount?.loan_amount;

  const txHash = txResult.result.txhash;

  return {
    txInfo,
    txResult,
    details: [
      repaidAmount && {
        name: 'Repaid Amount',
        value: formatUSTWithPostfixUnits(demicrofy(repaidAmount)) + ' UST',
      },
      newLtv && {
        name: 'New LTV',
        value: formatRateToPercentage(newLtv) + ' %',
      },
      outstandingLoan && {
        name: 'Outstanding Loan',
        value: formatUSTWithPostfixUnits(demicrofy(outstandingLoan)) + ' UST',
      },
      {
        name: 'Tx Hash',
        value: createElement(TxHashLink, { txHash }),
      },
      {
        name: 'Tx Fee',
        value: formatUSTWithPostfixUnits(demicrofy(txFee)) + ' UST',
      },
    ],
  };
}
