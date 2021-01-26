import { demicrofy, formatLuna, uLuna } from '@anchor-protocol/notation';
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

export function pickWithdrawResult({
  txInfo,
  txResult,
}: Params): TransactionResult {
  const rawLog = pickRawLog(txInfo, 0);

  if (!rawLog) {
    throw new TxInfoParseError(txResult, txInfo, 'Undefined the RawLog');
  }

  const transfer = pickEvent(rawLog, 'transfer');

  console.log('pickWithdrawResult.ts..pickWithdrawResult()', transfer);

  if (!transfer) {
    throw new TxInfoParseError(
      txResult,
      txInfo,
      'Undefined the transfer event',
    );
  }

  const unbondedAmount = pickAttributeValue<uLuna>(transfer, 2);

  const txFee = pickTxFee(txResult);

  const txHash = txResult.result.txhash;

  return {
    txInfo,
    txResult,
    txFee,
    txHash,
    details: [
      unbondedAmount && {
        name: 'Unbonded Amount',
        value: formatLuna(demicrofy(unbondedAmount)) + ' Luna',
      },
    ],
  };
}
