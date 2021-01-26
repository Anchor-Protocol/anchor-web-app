import {
  demicrofy,
  formatFluidDecimalPoints,
  formatUSTWithPostfixUnits,
  Ratio,
  uaUST,
  uUST,
} from '@anchor-protocol/notation';
import big, { BigSource } from 'big.js';
import { TxInfoParseError } from 'errors/TxInfoParseError';
import { TransactionResult } from 'models/transaction';
import {
  Data,
  pickAttributeValue,
  pickEvent,
  pickRawLog,
} from 'queries/txInfos';
import { TxResult } from 'transactions/tx';

interface Params {
  txResult: TxResult;
  txInfo: Data;
  txFee: uUST;
}

export function pickWithdrawResult({
  txInfo,
  txResult,
  txFee,
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

  const redeemAmount = pickAttributeValue<uUST>(fromContract, 8);

  const burnAmount = pickAttributeValue<uaUST>(fromContract, 7);

  const exchangeRate =
    redeemAmount &&
    burnAmount &&
    (big(redeemAmount).div(burnAmount) as Ratio<BigSource> | undefined);

  const txHash = txResult.result.txhash;

  return {
    txInfo,
    txResult,
    txFee,
    txHash,
    details: [
      redeemAmount && {
        name: 'Withdraw Amount',
        value: formatUSTWithPostfixUnits(demicrofy(redeemAmount)) + ' UST',
      },
      burnAmount && {
        name: 'Returned Amount',
        value: formatUSTWithPostfixUnits(demicrofy(burnAmount)) + ' aUST',
      },
      exchangeRate && {
        name: 'Exchange Rate',
        value: formatFluidDecimalPoints(exchangeRate, 2),
      },
    ],
  };
}
