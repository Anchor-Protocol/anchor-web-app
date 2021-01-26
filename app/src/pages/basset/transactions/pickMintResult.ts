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

export function pickMintResult({
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

  const bondedAmount = pickAttributeValue<uLuna>(fromContract, 3);

  const mintedAmount = pickAttributeValue<ubLuna>(fromContract, 4);

  const exchangeRate =
    bondedAmount &&
    mintedAmount &&
    (big(bondedAmount).div(mintedAmount) as Ratio<BigSource> | undefined);

  const txFee = pickTxFee(txResult);

  const txHash = txResult.result.txhash;

  return {
    txInfo,
    txResult,
    txFee,
    txHash,
    details: [
      bondedAmount && {
        name: 'Bonded Amount',
        value: formatLuna(demicrofy(bondedAmount)) + ' Luna',
      },
      mintedAmount && {
        name: 'Minted Amount',
        value: formatLuna(demicrofy(mintedAmount)) + ' bLuna',
      },
      exchangeRate && {
        name: 'Exchange Rate',
        value: formatFluidDecimalPoints(exchangeRate, 2),
      },
    ],
  };
}
