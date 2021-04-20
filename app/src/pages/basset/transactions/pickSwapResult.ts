import {
  demicrofy,
  formatFluidDecimalPoints,
  formatLuna,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { Rate, ubLuna, uLuna, uUST } from '@anchor-protocol/types';
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
import { TxResult } from '@anchor-protocol/wallet-provider';

interface Params {
  txResult: TxResult;
  txInfo: Data;
  fixedGas: uUST<BigSource>;
}

export function pickSwapResult({
  txInfo,
  txResult,
  fixedGas,
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

  const boughtAmount = pickAttributeValue<uLuna>(fromContract, 18);
  const paidAmount = pickAttributeValue<ubLuna>(fromContract, 17);
  const tradingFee1 = pickAttributeValue<uLuna>(fromContract, 20);
  const tradingFee2 = pickAttributeValue<uLuna>(fromContract, 21);

  const exchangeRate =
    boughtAmount &&
    paidAmount &&
    (big(boughtAmount).div(paidAmount) as Rate<BigSource> | undefined);

  const txHash = txResult.result.txhash;

  return {
    txInfo,
    txResult,
    //txFee: undefined,
    //txHash,
    details: [
      paidAmount && {
        name: 'Paid Amount',
        value: formatLuna(demicrofy(paidAmount)) + ' bLuna',
      },
      boughtAmount && {
        name: 'Bought Amount',
        value: formatLuna(demicrofy(boughtAmount)) + ' Luna',
      },
      exchangeRate && {
        name: 'Exchange Rate',
        value: formatFluidDecimalPoints(exchangeRate, 6),
      },
      {
        name: 'Tx Hash',
        value: createElement(TxHashLink, { txHash }),
      },
      tradingFee1 &&
        tradingFee2 && {
          name: 'Trading Fee',
          value:
            formatLuna(
              demicrofy(big(tradingFee1).plus(tradingFee2) as uLuna<Big>),
            ) + ' Luna',
        },
      {
        name: 'Tx Fee',
        value: formatUSTWithPostfixUnits(demicrofy(fixedGas)) + ' UST',
      },
    ],
  };
}
