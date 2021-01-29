import {
  demicrofy,
  formatUSTWithPostfixUnits,
  stripUUSD,
  truncate,
  uUST,
} from '@anchor-protocol/notation';
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
}

export function pickClaimResult({
  txInfo,
  txResult,
}: Params): TransactionResult {
  const rawLog = pickRawLog(txInfo, 0);

  if (!rawLog) {
    throw new TxInfoParseError(txResult, txInfo, 'Undefined the RawLog');
  }

  const transfer = pickEvent(rawLog, 'transfer');

  if (!transfer) {
    throw new TxInfoParseError(
      txResult,
      txInfo,
      'Undefined the transfer event',
    );
  }

  console.log('pickClaimResult.ts..pickClaimResult()', transfer);

  const claimedReward = pickAttributeValue<string>(transfer, 5);

  const txFee = pickAttributeValue<string>(transfer, 2);

  const txHash = txResult.result.txhash;

  return {
    txInfo,
    txResult,
    //txFee: txFee ? stripUUSD(txFee) : ('0' as uUST),
    //txHash,
    details: [
      !!claimedReward && {
        name: 'Claimed Reward',
        value:
          formatUSTWithPostfixUnits(demicrofy(stripUUSD(claimedReward))) +
          ' UST',
      },
      {
        name: 'Tx Hash',
        value: truncate(txHash),
      },
      {
        name: 'Tx Fee',
        value:
          formatUSTWithPostfixUnits(
            demicrofy(txFee ? stripUUSD(txFee) : ('0' as uUST)),
          ) + ' UST',
      },
    ],
  };
}
