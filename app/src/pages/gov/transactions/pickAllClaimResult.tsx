import {
  demicrofy,
  formatLP,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { uANC, uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { TxHashLink } from 'base/components/TxHashLink';
import { TxInfoParseError } from 'base/errors/TxInfoParseError';
import { TransactionResult } from 'base/models/transaction';
import {
  Data,
  pickAttributeValueByKey,
  pickEvent,
  RawLogEvent,
} from 'base/queries/txInfos';
import { createElement } from 'react';
import { TxResult } from '@terra-money/wallet-provider';

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
