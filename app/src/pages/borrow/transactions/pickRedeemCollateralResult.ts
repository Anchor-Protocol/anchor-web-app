import {
  demicrofy,
  formatLuna,
  formatRatioToPercentage,
  ubLuna,
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

export function pickRedeemCollateralResult({
  txInfo,
  txResult,
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

  const redeemedAmount = pickAttributeValue<ubLuna>(fromContract, 16);

  const newLtv = currentLtv(
    marketUserOverview.loanAmount.loan_amount,
    marketUserOverview.borrowInfo.balance,
    marketUserOverview.borrowInfo.spendable,
    marketOverview.oraclePrice.rate,
  );

  const txFee = pickTxFee(txResult);

  const txHash = txResult.result.txhash;

  return {
    txInfo,
    txResult,
    txFee,
    txHash,
    details: [
      redeemedAmount && {
        name: 'Redeemed Amount',
        value: formatLuna(demicrofy(redeemedAmount)) + ' bLuna',
      },
      newLtv && {
        name: 'New LTV',
        value: formatRatioToPercentage(newLtv) + ' %',
      },
    ],
  };
}
