import {
  demicrofy,
  formatFluidDecimalPoints,
  formatLuna,
  formatUSTWithPostfixUnits,
  Ratio,
  ubLuna,
  uLuna,
  uUST,
} from '@anchor-protocol/notation';
import big, { BigSource } from 'big.js';
import { TxHashLink } from 'components/TxHashLink';
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
  txFee: uUST;
}

export function pickMintResult({
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

  const bondedAmount = pickAttributeValue<uLuna>(fromContract, 3);

  const mintedAmount = pickAttributeValue<ubLuna>(fromContract, 4);

  const exchangeRate =
    bondedAmount &&
    mintedAmount &&
    (big(bondedAmount).div(mintedAmount) as Ratio<BigSource> | undefined);

  const txHash = txResult.result.txhash;

  return {
    txInfo,
    txResult,
    //txFee,
    //txHash,
    details: [
      bondedAmount && {
        name: 'Bonded Amount',
        value: formatLuna(demicrofy(bondedAmount)) + ' Luna',
      },
      mintedAmount && {
        name: 'Minted Amount',
        value: formatLuna(demicrofy(mintedAmount)) + ' bLuna',
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
