import {
  demicrofy,
  formatLuna,
  formatRate,
  formatUSTWithPostfixUnits,
} from '@anchor-protocol/notation';
import { moneyMarket, Rate, ubLuna, uUST } from '@anchor-protocol/types';
import { TxHashLink } from 'base/components/TxHashLink';
import { TxInfoParseError } from 'base/errors/TxInfoParseError';
import { TransactionResult } from 'base/models/transaction';
import { currentLtv } from 'pages/borrow/logics/currentLtv';
import {
  Data,
  pickAttributeValue,
  pickEvent,
  pickRawLog,
} from 'base/queries/txInfos';
import { createElement } from 'react';
import { TxResult } from '@anchor-protocol/wallet-provider2';

interface Params {
  txResult: TxResult;
  txInfo: Data;
  txFee: uUST;
  loanAmount?: moneyMarket.market.BorrowerInfoResponse;
  borrowInfo?: moneyMarket.custody.BorrowerResponse;
  oraclePrice?: moneyMarket.oracle.PriceResponse;
}

export function pickRedeemCollateralResult({
  txInfo,
  txResult,
  txFee,
  loanAmount,
  borrowInfo,
  oraclePrice,
}: Params): TransactionResult {
  const rawLog = pickRawLog(txInfo, 1);

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

  const redeemedAmount = pickAttributeValue<ubLuna>(fromContract, 16);

  const newLtv =
    loanAmount && borrowInfo && oraclePrice
      ? currentLtv(loanAmount, borrowInfo, oraclePrice)
      : ('0' as Rate);

  const txHash = txResult.result.txhash;

  return {
    txInfo,
    txResult,
    details: [
      redeemedAmount && {
        name: 'Redeemed Amount',
        value: formatLuna(demicrofy(redeemedAmount)) + ' bLuna',
      },
      newLtv && {
        name: 'New LTV',
        value: formatRate(newLtv) + ' %',
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
