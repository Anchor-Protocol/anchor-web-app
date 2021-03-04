import { min } from '@anchor-protocol/big-math';
import {
  demicrofy,
  formatANCWithPostfixUnits,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { uANC, UST, uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { TxHashLink } from 'components/TxHashLink';
import { Bank } from 'contexts/bank';
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
  bank: Bank;
}

export function pickBuyResult({
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

  if (!fromContract) {
    throw new TxInfoParseError(
      txResult,
      txInfo,
      'Undefined the from_contract event',
    );
  }

  const return_amount = pickAttributeValueByKey<uANC>(
    fromContract,
    'return_amount',
  );
  const offer_amount = pickAttributeValueByKey<uUST>(
    fromContract,
    'offer_amount',
  );
  const spread_amount = pickAttributeValueByKey<uUST>(
    fromContract,
    'spread_amount',
  );
  const commission_amount = pickAttributeValueByKey<uUST>(
    fromContract,
    'commission_amount',
  );

  const pricePerANC =
    return_amount && offer_amount
      ? (big(return_amount).div(offer_amount) as UST<Big>)
      : undefined;
  const tradingFee =
    spread_amount && commission_amount
      ? (big(spread_amount).plus(commission_amount) as uUST<Big>)
      : undefined;
  const txFee = offer_amount
    ? (big(fixedGas).plus(
        min(big(offer_amount).mul(bank.tax.taxRate), bank.tax.maxTaxUUSD),
      ) as uUST<Big>)
    : undefined;
  const txHash = txResult.result.txhash;

  return {
    txInfo,
    txResult,
    details: [
      return_amount && {
        name: 'Bought',
        value: formatANCWithPostfixUnits(demicrofy(return_amount)) + ' ANC',
      },
      offer_amount && {
        name: 'Paid',
        value: formatUSTWithPostfixUnits(demicrofy(offer_amount)) + ' UST',
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
