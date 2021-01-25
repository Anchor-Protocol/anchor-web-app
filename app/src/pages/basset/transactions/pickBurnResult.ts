import {
  demicrofy,
  formatFluidDecimalPoints,
  formatLuna,
  Ratio,
  ubLuna,
  uLuna,
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

export function pickBurnResult({
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

  console.log('pickBurnResult.ts..pickBurnResult()', fromContract);

  // TODO wrong index
  const burnedAmount = pickAttributeValue<uLuna>(fromContract, 16);

  const expectedAmount = pickAttributeValue<ubLuna>(fromContract, 17);

  console.log(
    'pickBurnResult.ts..pickBurnResult()',
    burnedAmount,
    expectedAmount,
  );

  const exchangeRate =
    burnedAmount &&
    expectedAmount &&
    (big(expectedAmount).div(burnedAmount) as Ratio<BigSource> | undefined);

  const txFee = pickTxFee(txResult);

  const txHash = txResult.result.txhash;

  return {
    txInfo,
    txResult,
    txFee,
    txHash,
    details: [
      burnedAmount && {
        name: 'Burned Amount',
        value: formatLuna(demicrofy(burnedAmount)) + ' bLuna',
      },
      expectedAmount && {
        name: 'Expected Amount',
        value: formatLuna(demicrofy(expectedAmount)) + ' Luna',
      },
      exchangeRate && {
        name: 'Exchange Rate',
        value: formatFluidDecimalPoints(exchangeRate, 2),
      },
    ],
  };
}
