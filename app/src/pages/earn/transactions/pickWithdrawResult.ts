import {
  demicrofy,
  formatAUSTWithPostfixUnits,
  formatFluidDecimalPoints,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { Rate, uaUST, uUST } from '@anchor-protocol/types';
import big, { BigSource } from 'big.js';
import { TxHashLink } from 'base/components/TxHashLink';
import { TxInfoParseError } from 'base/errors/TxInfoParseError';
import { TransactionResult } from 'base/models/transaction';
import {
  Data,
  pickAttributeValue,
  pickEvent,
  pickRawLog,
} from 'base/queries/txInfos';
import { createElement } from 'react';
import { TxResult } from 'base/transactions/tx';

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
    (big(redeemAmount).div(burnAmount) as Rate<BigSource> | undefined);

  const txHash = txResult.result.txhash;

  return {
    txInfo,
    txResult,
    //txFee,
    //txHash,
    details: [
      redeemAmount && {
        name: 'Withdraw Amount',
        value: formatUSTWithPostfixUnits(demicrofy(redeemAmount)) + ' UST',
      },
      burnAmount && {
        name: 'Returned Amount',
        value: formatAUSTWithPostfixUnits(demicrofy(burnAmount)) + ' aUST',
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
