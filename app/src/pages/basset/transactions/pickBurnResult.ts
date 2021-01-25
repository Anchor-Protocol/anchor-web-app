import { Ratio, uaUST, uUST } from '@anchor-protocol/notation';
import big from 'big.js';
import { Data } from 'queries/txInfos';
import { TxResult } from 'transactions/tx';

interface Params {
  txResult: TxResult;
  txInfo: Data;
}

export interface BurnResult {
  depositAmount: uUST<string> | undefined;
  receivedAmount: uaUST<string> | undefined;
  exchangeRate: Ratio<string> | undefined;
  txFee: uUST<string>;
  txHash: string;
}

export function pickBurnResult({ txInfo, txResult }: Params): BurnResult {
  const fromContract =
    Array.isArray(txInfo[0].RawLog) && txInfo[0].RawLog[0].events[1];

  if (!fromContract) {
    console.error({ txInfo, txResult });
    throw new Error(`Failed contract result parse`);
  }

  // TODO

  const depositAmount = fromContract.attributes.find(
    ({ key }: { key: string }) => key === 'deposit_amount',
  )?.value as uUST | undefined;

  const receivedAmount = fromContract.attributes.find(
    ({ key }: { key: string }) => key === 'mint_amount',
  )?.value as uaUST | undefined;

  const exchangeRate =
    depositAmount &&
    receivedAmount &&
    (big(receivedAmount).div(depositAmount).toFixed() as Ratio | undefined);

  const txFee = big(txResult.fee.amount[0].amount)
    .plus(txResult.fee.gas)
    .toFixed() as uUST;

  const txHash = txResult.result.txhash;

  return {
    depositAmount,
    receivedAmount,
    exchangeRate,
    txFee,
    txHash,
  };
}
