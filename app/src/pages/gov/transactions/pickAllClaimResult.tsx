import {
  demicrofy,
  formatLP,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { uANC, uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { TxHashLink } from 'components/TxHashLink';
import { TxInfoParseError } from 'errors/TxInfoParseError';
import { TransactionResult } from 'models/transaction';
import {
  Data,
  pickAttributeValueByKey,
  pickEvent,
  RawLogEvent,
} from 'queries/txInfos';
import { createElement } from 'react';
import { TxResult } from 'transactions/tx';

interface Params {
  txResult: TxResult;
  txInfo: Data;
  fixedGas: uUST<BigSource>;
}

export function pickAllClaimResult({
  txInfo,
  txResult,
  fixedGas,
}: Params): TransactionResult {
  console.log(JSON.stringify(txInfo, null, 2));

  const fromContracts = txInfo.reduce((fromContracts, { RawLog }) => {
    for (const rawLog of RawLog) {
      if (typeof rawLog !== 'string') {
        const fromContract = pickEvent(rawLog, 'from_contract');
        if (fromContract) {
          fromContracts.push(fromContract);
        }
      }
    }
    return fromContracts;
  }, [] as RawLogEvent[]);

  if (fromContracts.length === 0) {
    throw new TxInfoParseError(
      txResult,
      txInfo,
      'Undefined the from_contract events',
    );
  }

  const claimed = fromContracts.reduce((claimed, fromContract) => {
    const amount = pickAttributeValueByKey<uANC>(
      fromContract,
      'amount',
      (attrs) => attrs.reverse()[0],
    );
    return amount ? claimed.plus(amount) : claimed;
  }, big(0)) as uANC<Big>;

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
