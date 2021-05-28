import {
  demicrofy,
  formatUSTWithPostfixUnits,
  stripUUSD,
} from '@anchor-protocol/notation';
import { uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
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
import { TxResult } from '@terra-money/wallet-provider';

interface Params {
  txResult: TxResult;
  txInfo: Data;
  fixedGas: uUST<BigSource>;
}

export function pickClaimResult({
  txInfo,
  txResult,
  fixedGas,
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
        value: createElement(TxHashLink, { txHash }),
      },
      {
        name: 'Tx Fee',
        value:
          formatUSTWithPostfixUnits(
            demicrofy(
              big(txFee ? stripUUSD(txFee) : '0').plus(fixedGas) as uUST<Big>,
            ),
          ) + ' UST',
      },
    ],
  };
}
