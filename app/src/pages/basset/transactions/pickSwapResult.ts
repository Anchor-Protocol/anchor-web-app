import {
  demicrofy,
  formatFluidDecimalPoints,
  formatLuna,
  formatUSTWithPostfixUnits,
  Ratio,
  ubLuna,
  uLuna,
} from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';
import { TxHashLink } from 'components/TxHashLink';
import { FIXED_GAS } from 'env';
import { TxInfoParseError } from 'errors/TxInfoParseError';
import { TransactionResult } from 'models/transaction';
import {
  Data,
  pickAttributeValue,
  pickEvent,
  pickRawLog,
} from 'queries/txInfos';
import { createElement } from 'react';
import { TxResult } from 'transactions/tx';

interface Params {
  txResult: TxResult;
  txInfo: Data;
}

export function pickSwapResult({
  txInfo,
  txResult,
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
  //Bought Amount = Event[1][“attributes”][18][‘value’]
  //Paid Amount = Event[1][“attributes”][17][‘value’]
  //Exchange Rate = Bought Amount / Paid_amount
  //Trading Fee = Event[1][“attributes”][20][‘value’] + Event[1][“attributes”][21][‘value’]
  //Tx Fee = same as pop up Tx Fee
  //Tx Hash = Tx hash of this Tx

  const boughtAmount = pickAttributeValue<uLuna>(fromContract, 18);
  const paidAmount = pickAttributeValue<ubLuna>(fromContract, 17);
  const tradingFee1 = pickAttributeValue<uLuna>(fromContract, 20);
  const tradingFee2 = pickAttributeValue<uLuna>(fromContract, 21);

  const exchangeRate =
    boughtAmount &&
    paidAmount &&
    (big(boughtAmount).div(paidAmount) as Ratio<BigSource> | undefined);

  //console.log('pickSwapResult.ts..pickSwapResult()', rawLog);
  //
  //console.log('pickSwapResult.ts..pickSwapResult()', {
  //  boughtAmount,
  //  paidAmount,
  //  tradingFee1,
  //  tradingFee2,
  //});

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
          name: 'Tranding Fee',
          value:
            formatLuna(
              demicrofy(big(tradingFee1).plus(tradingFee2) as uLuna<Big>),
            ) + ' Luna',
        },
      {
        name: 'Tx Fee',
        value: formatUSTWithPostfixUnits(demicrofy(FIXED_GAS)) + ' UST',
      },
    ],
  };
}
