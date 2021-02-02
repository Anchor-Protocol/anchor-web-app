import {
  demicrofy,
  formatLuna,
  formatRatioToPercentage,
  formatUSTWithPostfixUnits,
  ubLuna,
  uUST,
} from '@anchor-protocol/notation';
import { TxHashLink } from 'components/TxHashLink';
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
import { createElement } from 'react';
import { TxResult } from 'transactions/tx';

interface Params {
  txResult: TxResult;
  txInfo: Data;
  txFee: uUST;
  marketBalance: MarketBalance;
  marketOverview: MarketOverview;
  marketUserOverview: MarketUserOverview;
}

export function pickProvideCollateralResult({
  txInfo,
  txResult,
  txFee,
  marketOverview,
  marketUserOverview,
}: Params): TransactionResult {
  const rawLog = pickRawLog(txInfo, 1);

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

  const collateralizedAmount = pickAttributeValue<ubLuna>(fromContract, 7);

  const newLtv = currentLtv(
    marketUserOverview.loanAmount.loan_amount,
    marketUserOverview.borrowInfo.balance,
    marketUserOverview.borrowInfo.spendable,
    marketOverview.oraclePrice.rate,
  );

  const txHash = txResult.result.txhash;

  return {
    txInfo,
    txResult,
    //txFee,
    //txHash,
    details: [
      collateralizedAmount && {
        name: 'Collateralized Amount',
        value: formatLuna(demicrofy(collateralizedAmount)) + ' bLuna',
      },
      newLtv && {
        name: 'New LTV',
        value: formatRatioToPercentage(newLtv) + ' %',
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
