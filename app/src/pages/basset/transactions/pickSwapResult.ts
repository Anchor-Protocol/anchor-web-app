import {
  demicrofy,
  formatLuna,
  formatUSTWithPostfixUnits,
  truncate,
  uLuna,
} from '@anchor-protocol/notation';
import { FIXED_GAS } from 'env';
import { TxInfoParseError } from 'errors/TxInfoParseError';
import { TransactionResult } from 'models/transaction';
import { Data, pickEvent, pickRawLog } from 'queries/txInfos';
import { TxResult } from 'transactions/tx';

interface Params {
  txResult: TxResult;
  txInfo: Data;
  swapFee: uLuna;
}

export function pickSwapResult({
  txInfo,
  txResult,
  swapFee,
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

  // TODO restore this indexes
  //const burnedAmount = pickAttributeValue<uLuna>(fromContract, 16);
  //const expectedAmount = pickAttributeValue<ubLuna>(fromContract, 17);

  //const burnedAmount = pickAttributeValue<uLuna>(fromContract, 4);
  //const expectedAmount = pickAttributeValue<ubLuna>(fromContract, 16);
  //
  //const exchangeRate =
  //  burnedAmount &&
  //  expectedAmount &&
  //  (big(expectedAmount).div(burnedAmount) as Ratio<BigSource> | undefined);

  const txHash = txResult.result.txhash;

  return {
    txInfo,
    txResult,
    //txFee: undefined,
    //txHash,
    details: [
      //burnedAmount && {
      //  name: 'Burned Amount',
      //  value: formatLuna(demicrofy(burnedAmount)) + ' bLuna',
      //},
      //expectedAmount && {
      //  name: 'Expected Amount',
      //  value: formatLuna(demicrofy(expectedAmount)) + ' Luna',
      //},
      //exchangeRate && {
      //  name: 'Exchange Rate',
      //  value: formatFluidDecimalPoints(exchangeRate, 2),
      //},
      {
        name: 'Tx Hash',
        value: truncate(txHash),
      },
      {
        name: 'Swap Fee',
        value:
          formatLuna(demicrofy(swapFee)) +
          ' Luna + ' +
          formatUSTWithPostfixUnits(demicrofy(FIXED_GAS)) +
          ' UST',
      },
    ],
  };
}
