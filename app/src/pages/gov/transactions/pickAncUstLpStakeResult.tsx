import {
  demicrofy,
  formatLP,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { uAncUstLP, uUST } from '@anchor-protocol/types';
import { BigSource } from 'big.js';
import { TxHashLink } from '@anchor-protocol/web-contexts/components/TxHashLink';
import { TxInfoParseError } from '@anchor-protocol/web-contexts/errors/TxInfoParseError';
import { TransactionResult } from '@anchor-protocol/web-contexts/models/transaction';
import {
  Data,
  pickAttributeValueByKey,
  pickEvent,
  pickRawLog,
} from '@anchor-protocol/web-contexts/queries/txInfos';
import { createElement } from 'react';
import { TxResult } from '@anchor-protocol/web-contexts/transactions/tx';

interface Params {
  txResult: TxResult;
  txInfo: Data;
  fixedGas: uUST<BigSource>;
}

export function pickAncUstLpStakeResult({
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

  const amount = pickAttributeValueByKey<uAncUstLP>(fromContract, 'amount');

  const txFee = fixedGas;
  const txHash = txResult.result.txhash;

  return {
    txInfo,
    txResult,
    details: [
      amount && {
        name: 'Amount',
        value: formatLP(demicrofy(amount)) + ' ANC-UST-LP',
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
