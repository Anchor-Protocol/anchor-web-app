import {
  demicrofy,
  formatANCWithPostfixUnits,
  formatUSTWithPostfixUnits,
  stripUUSD,
} from '@anchor-protocol/notation';
import { uANC, UST, uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { TxHashLink } from 'base/components/TxHashLink';
import { Bank } from 'base/contexts/bank';
import { TxInfoParseError } from 'base/errors/TxInfoParseError';
import { TransactionResult } from 'base/models/transaction';
import {
  Data,
  pickAttributeValueByKey,
  pickEvent,
  pickRawLog,
} from 'base/queries/txInfos';
import { createElement } from 'react';
import { TxResult } from 'base/transactions/tx';

interface Params {
  txResult: TxResult;
  txInfo: Data;
  fixedGas: uUST<BigSource>;
  bank: Bank;
}

export function pickSellResult({
  txInfo,
  txResult,
  fixedGas,
  bank,
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
      'Undefined the from_contract event',
    );
  }

  // sold
  const offer_amount = pickAttributeValueByKey<uUST>(
    fromContract,
    'offer_amount',
  );
  // earned
  const return_amount = pickAttributeValueByKey<uANC>(
    fromContract,
    'return_amount',
  );
  const spread_amount = pickAttributeValueByKey<uUST>(
    fromContract,
    'spread_amount',
  );
  const commission_amount = pickAttributeValueByKey<uUST>(
    fromContract,
    'commission_amount',
  );
  const transfer_amount = stripUUSD(
    pickAttributeValueByKey<uUST>(transfer, 'amount', (attrs) => attrs[0]) ??
      '0uusd',
  );

  const pricePerANC =
    return_amount && offer_amount
      ? (big(return_amount).div(offer_amount) as UST<Big>)
      : undefined;
  const tradingFee =
    spread_amount && commission_amount
      ? (big(spread_amount).plus(commission_amount) as uUST<Big>)
      : undefined;
  const txFee = big(fixedGas).plus(transfer_amount) as uUST<Big>;
  const txHash = txResult.result.txhash;

  return {
    txInfo,
    txResult,
    details: [
      offer_amount && {
        name: 'Sold',
        value: formatUSTWithPostfixUnits(demicrofy(offer_amount)) + ' ANC',
      },
      return_amount && {
        name: 'Earned',
        value: formatANCWithPostfixUnits(demicrofy(return_amount)) + ' UST',
      },
      pricePerANC && {
        name: 'Price per ANC',
        value: formatUSTWithPostfixUnits(pricePerANC) + ' UST',
      },
      tradingFee && {
        name: 'Trading Fee',
        value: formatUSTWithPostfixUnits(demicrofy(tradingFee)) + ' UST',
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
