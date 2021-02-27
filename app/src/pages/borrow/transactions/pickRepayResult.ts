import {
  demicrofy,
  formatRateToPercentage,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { Rate, uUST } from '@anchor-protocol/types';
import { TxHashLink } from 'components/TxHashLink';
import { TxInfoParseError } from 'errors/TxInfoParseError';
import { TransactionResult } from 'models/transaction';
import { currentLtv } from 'pages/borrow/logics/currentLtv';
import { Data as MarketState } from 'pages/borrow/queries/marketState';
import { Data as MarketOverview } from 'pages/borrow/queries/marketOverview';
import { Data as MarketUserOverview } from 'pages/borrow/queries/marketUserOverview';
import {
  Data,
  pickAttributeValue,
  pickEvent,
  pickRawLog,
} from 'queries/txInfos';
import { createElement } from 'react';
import { TxResult } from 'transactions/tx';

interface Params {
  txResult: TxResult;
  txInfo: Data;
  txFee: uUST;
  currentBlock?: MarketState['currentBlock'];
  marketBalance?: MarketState['marketBalance'];
  marketState?: MarketState['marketState'];
  borrowRate?: MarketOverview['borrowRate'];
  oraclePrice?: MarketOverview['oraclePrice'];
  overseerWhitelist?: MarketOverview['overseerWhitelist'];
  loanAmount?: MarketUserOverview['loanAmount'];
  borrowInfo?: MarketUserOverview['borrowInfo'];
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
      ? currentLtv(
          loanAmount?.loan_amount,
          borrowInfo?.balance,
          borrowInfo?.spendable,
          oraclePrice?.rate,
        )
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
