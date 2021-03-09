import {
  demicrofy,
  formatFluidDecimalPoints,
  formatLuna,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { Rate, ubLuna, uLuna, uUST } from '@anchor-protocol/types';
import big, { BigSource } from 'big.js';
import { TxHashLink } from '@anchor-protocol/web-contexts/components/TxHashLink';
import { TxInfoParseError } from '@anchor-protocol/web-contexts/errors/TxInfoParseError';
import { TransactionResult } from '@anchor-protocol/web-contexts/models/transaction';
import {
  Data,
  pickAttributeValue,
  pickEvent,
  pickRawLog,
} from '@anchor-protocol/web-contexts/queries/txInfos';
import { createElement } from 'react';
import { TxResult } from '@anchor-protocol/web-contexts/transactions/tx';

interface Params {
  txResult: TxResult;
  txInfo: Data;
  txFee: uUST;
}

export function pickBurnResult({
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

  const burnedAmount = pickAttributeValue<uLuna>(fromContract, 4);
  const expectedAmount = pickAttributeValue<ubLuna>(fromContract, 16);

  console.log(
    'pickBurnResult.ts..pickBurnResult()',
    burnedAmount,
    expectedAmount,
  );

  const exchangeRate =
    burnedAmount &&
    expectedAmount &&
    (big(expectedAmount).div(burnedAmount) as Rate<BigSource> | undefined);

  const txHash = txResult.result.txhash;

  return {
    txInfo,
    txResult,
    //txFee,
    //txHash,
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
        value: formatFluidDecimalPoints(exchangeRate, 6),
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
