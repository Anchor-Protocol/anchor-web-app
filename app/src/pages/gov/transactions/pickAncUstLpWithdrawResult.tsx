import {
  demicrofy,
  formatANCWithPostfixUnits,
  formatLP,
  formatUSTWithPostfixUnits,
  stripUUSD,
} from '@anchor-protocol/notation';
import { uANC, uAncUstLP, uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { TxHashLink } from 'base/components/TxHashLink';
import { TxInfoParseError } from 'base/errors/TxInfoParseError';
import { TransactionResult } from 'base/models/transaction';
import {
  Data,
  pickAttributeValueByKey,
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

export function pickAncUstLpWithdrawResult({
  txInfo,
  txResult,
  fixedGas,
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
      'Undefined the from_contract | transfer event',
    );
  }

  const burned = pickAttributeValueByKey<uAncUstLP>(
    fromContract,
    'withdrawn_share',
  );

  const receivedAnc = pickAttributeValueByKey<uANC>(
    fromContract,
    'amount',
    (attrs) => attrs.reverse()[1],
  );
  const receivedUusd = pickAttributeValueByKey<string>(
    transfer,
    'amount',
    (attrs) => attrs.reverse()[0],
  );
  const receivedUst = !!receivedUusd && stripUUSD(receivedUusd);

  const transferAmount = pickAttributeValueByKey<string>(transfer, 'amount');
  const transferFee = transferAmount && stripUUSD(transferAmount);

  const txFee = !!transferFee && (big(fixedGas).plus(transferFee) as uUST<Big>);
  const txHash = txResult.result.txhash;

  return {
    txInfo,
    txResult,
    details: [
      burned && {
        name: 'Burned',
        value: formatLP(demicrofy(burned)) + ' ANC-UST LP',
      },
      receivedAnc &&
        receivedUst && {
          name: 'Received',
          value:
            formatANCWithPostfixUnits(demicrofy(receivedAnc)) +
            ' ANC + ' +
            formatUSTWithPostfixUnits(demicrofy(receivedUst)) +
            ' UST',
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
