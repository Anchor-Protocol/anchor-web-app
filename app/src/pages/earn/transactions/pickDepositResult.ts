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
import { pickTxFee, TxResult } from 'transactions/tx';

interface Params {
  txResult: TxResult;
  txInfo: Data;
}

export function pickDepositResult({
  txInfo,
  txResult,
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

  const depositAmount = pickAttributeValue<uUST>(fromContract, 4);

  const receivedAmount = pickAttributeValue<uaUST>(fromContract, 3);

  const exchangeRate =
    depositAmount &&
    receivedAmount &&
    (big(depositAmount).div(receivedAmount) as Ratio<BigSource> | undefined);

  const txFee = pickTxFee(txResult);

  const txHash = txResult.result.txhash;

  return {
    txInfo,
    txResult,
    txFee,
    txHash,
    details: [
      depositAmount && {
        name: 'Deposit Amount',
        value: formatUSTWithPostfixUnits(demicrofy(depositAmount)) + ' UST',
      },
      receivedAmount && {
        name: 'Received Amount',
        value: formatUSTWithPostfixUnits(demicrofy(receivedAmount)) + ' aUST',
      },
      exchangeRate && {
        name: 'Exchange Rate',
        value: formatFluidDecimalPoints(exchangeRate, 2),
      },
    ],
  };
}
