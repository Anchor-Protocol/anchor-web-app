import {
  demicrofy,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { uUST } from '@anchor-protocol/types';
import { TxHashLink } from '@anchor-protocol/web-contexts/components/TxHashLink';
import { TransactionResult } from '@anchor-protocol/web-contexts/models/transaction';
import { Data } from '@anchor-protocol/web-contexts/queries/txInfos';
import { createElement } from 'react';
import { TxResult } from '@anchor-protocol/web-contexts/transactions/tx';

interface Params {
  txResult: TxResult;
  txInfo: Data;
  txFee: uUST;
}

export function pickCreatePollResult({
  txInfo,
  txResult,
  txFee,
}: Params): TransactionResult {
  //const rawLog = pickRawLog(txInfo, 0);
  //
  //if (!rawLog) {
  //  throw new TxInfoParseError(txResult, txInfo, 'Undefined the RawLog');
  //}
  //
  //const fromContract = pickEvent(rawLog, 'from_contract');
  //
  //if (!fromContract) {
  //  throw new TxInfoParseError(
  //    txResult,
  //    txInfo,
  //    'Undefined the from_contract event',
  //  );
  //}

  //const depositAmount = pickAttributeValue<uUST>(fromContract, 4);
  //
  //const receivedAmount = pickAttributeValue<uaUST>(fromContract, 3);
  //
  //const exchangeRate =
  //  depositAmount &&
  //  receivedAmount &&
  //  (big(depositAmount).div(receivedAmount) as Rate<BigSource> | undefined);

  const txHash = txResult.result.txhash;

  return {
    txInfo,
    txResult,
    details: [
      //depositAmount && {
      //  name: 'Deposit Amount',
      //  value: formatUSTWithPostfixUnits(demicrofy(depositAmount)) + ' UST',
      //},
      //receivedAmount && {
      //  name: 'Received Amount',
      //  value: formatUSTWithPostfixUnits(demicrofy(receivedAmount)) + ' aUST',
      //},
      //exchangeRate && {
      //  name: 'Exchange Rate',
      //  value: formatFluidDecimalPoints(exchangeRate, 6),
      //},
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
