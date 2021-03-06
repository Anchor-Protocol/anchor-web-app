import {
  demicrofy,
  formatLP,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { uAncUstLP, uUST } from '@anchor-protocol/types';
import { BigSource } from 'big.js';
import { TxHashLink } from 'components/TxHashLink';
import { TxInfoParseError } from 'errors/TxInfoParseError';
import { TransactionResult } from 'models/transaction';
import {
  Data,
  pickAttributeValueByKey,
  pickEvent,
  pickRawLog,
} from 'queries/txInfos';
import { createElement } from 'react';
import { TxResult } from 'transactions/tx';

interface Params {
  txResult: TxResult;
  txInfo: Data;
  fixedGas: uUST<BigSource>;
}

export function pickAncUstLpClaimResult({
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

  const claimed = pickAttributeValueByKey<uAncUstLP>(
    fromContract,
    'amount',
    (attrs) => attrs.reverse()[0],
  );

  const txFee = fixedGas;
  const txHash = txResult.result.txhash;

  return {
    txInfo,
    txResult,
    details: [
      claimed && {
        name: 'Claimed',
        value: formatLP(demicrofy(claimed)) + ' ANC',
      },
      {
        name: 'Tx Hash',
        value: createElement(TxHashLink, { txHash }),
      },
      txFee && {
        name: 'Tx Fee',
        value: formatUSTWithPostfixUnits(demicrofy(txFee)) + ' UST',
      },
    ],
  };
}
