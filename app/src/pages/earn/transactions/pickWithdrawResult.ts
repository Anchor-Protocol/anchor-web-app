import {
  demicrofy,
  formatAUSTWithPostfixUnits,
  formatFluidDecimalPoints,
  formatUSTWithPostfixUnits,
  stripUUSD,
} from '@anchor-protocol/notation';
import { Rate, uaUST, uUST } from '@anchor-protocol/types';
import { TxHashLink } from 'base/components/TxHashLink';
import { TxInfoParseError } from 'base/errors/TxInfoParseError';
import { TransactionResult } from 'base/models/transaction';
import {
  Data,
  pickAttributeValueByKey,
  pickEvent,
  pickRawLog,
} from 'base/queries/txInfos';
import { TxResult } from '@anchor-protocol/wallet-provider2';
import big, { BigSource } from 'big.js';
import { createElement } from 'react';

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
  const transfer = pickEvent(rawLog, 'transfer');

  if (!fromContract || !transfer) {
    throw new TxInfoParseError(
      txResult,
      txInfo,
      'Undefined the from_contract or transfer event',
    );
  }

  const withdrawAmountUUSD = pickAttributeValueByKey<string>(
    transfer,
    'amount',
    (attrs) => attrs.reverse()[0],
  );
  const withdrawAmount = withdrawAmountUUSD
    ? stripUUSD(withdrawAmountUUSD)
    : undefined;

  const burnAmount = pickAttributeValueByKey<uaUST>(
    fromContract,
    'burn_amount',
  );

  const exchangeRate =
    withdrawAmount &&
    burnAmount &&
    (big(withdrawAmount).div(burnAmount) as Rate<BigSource> | undefined);

  const txHash = txResult.result.txhash;

  return {
    txInfo,
    txResult,
    //txFee,
    //txHash,
    details: [
      withdrawAmount && {
        name: 'Withdraw Amount',
        value: formatUSTWithPostfixUnits(demicrofy(withdrawAmount)) + ' UST',
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
