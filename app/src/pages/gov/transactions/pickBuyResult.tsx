import { uUST } from '@anchor-protocol/types';
import { BigSource } from 'big.js';
import { TxHashLink } from 'components/TxHashLink';
import { TxInfoParseError } from 'errors/TxInfoParseError';
import { TransactionResult } from 'models/transaction';
import { Data, pickEvent, pickRawLog } from 'queries/txInfos';
import { createElement } from 'react';
import { TxResult } from 'transactions/tx';

interface Params {
  txResult: TxResult;
  txInfo: Data;
  fixedGas: uUST<BigSource>;
}

export function pickBuyResult({
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

  console.log(
    'pickBuyResult.tsx..pickBuyResult()',
    JSON.stringify(fromContract, null, 2),
  );

  //const bought = pickAttributeValue<uANC>(fromContract, 18);
  //const paid = pickAttributeValue<uUST>(fromContract, 17);
  //const pricePerANC = big(bought ?? 0).div(paid ?? 1) as uUST<Big>;
  //const tradingFee = big(pickAttributeValue<uUST>(fromContract, 20) ?? 0).plus(
  //  pickAttributeValue<uUST>(fromContract, 21) ?? 0,
  //);
  //
  //const txFee = big(fixedGas).plus(paid ?? 0);
  const txHash = txResult.result.txhash;

  return {
    txInfo,
    txResult,
    details: [
      {
        name: 'Tx Hash',
        value: createElement(TxHashLink, { txHash }),
      },
    ],
  };
}
