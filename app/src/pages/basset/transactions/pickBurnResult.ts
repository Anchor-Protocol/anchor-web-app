import {
  demicrofy,
  formatFluidDecimalPoints,
  formatLuna,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { Rate, ubLuna, uLuna, uUST } from '@anchor-protocol/types';
import { TxResult } from '@anchor-protocol/wallet-provider';
import { TxHashLink } from 'base/components/TxHashLink';
import { TxInfoParseError } from 'base/errors/TxInfoParseError';
import { TransactionResult } from 'base/models/transaction';
import {
  Data,
  pickAttributeValueByKey,
  pickEvent,
  pickRawLog,
} from 'base/queries/txInfos';
import big, { BigSource } from 'big.js';
import { createElement } from 'react';

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

  const burnedAmount = pickAttributeValueByKey<uLuna>(
    fromContract,
    'amount',
    (attrs) => attrs[0],
  );
  const expectedAmount = pickAttributeValueByKey<ubLuna>(
    fromContract,
    'amount',
    (attrs) => attrs.reverse()[0],
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
