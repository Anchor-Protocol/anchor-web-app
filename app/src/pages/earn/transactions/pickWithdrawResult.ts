import { Ratio, uaUST, uUST } from '@anchor-protocol/notation';
import big from 'big.js';
import { Data } from 'queries/txInfos';
import { TxResult } from 'transactions/tx';

interface Params {
  txResult: TxResult;
  txInfo: Data;
}

export interface WithdrawResult {
  redeemAmount: uUST<string> | undefined;
  burnAmount: uaUST<string> | undefined;
  exchangeRate: Ratio<string> | undefined;
  txFee: uUST<string>;
  txHash: string;
}

export function pickWithdrawResult({
  txInfo,
  txResult,
}: Params): WithdrawResult {
  const fromContract =
    Array.isArray(txInfo[0].RawLog) && txInfo[0].RawLog[0].events[1];

  if (!fromContract) {
    console.error({ txInfo, txResult });
    throw new Error(`Failed contract result parse`);
  }

  const redeemAmount = fromContract.attributes.find(
    ({ key }: { key: string }) => key === 'redeem_amount',
  )?.value as uUST | undefined;

  const burnAmount = fromContract.attributes.find(
    ({ key }: { key: string }) => key === 'burn_amount',
  )?.value as uaUST | undefined;

  const exchangeRate =
    redeemAmount &&
    burnAmount &&
    (big(redeemAmount).div(burnAmount).toFixed() as Ratio | undefined);

  const txFee = big(txResult.fee.amount[0].amount)
    .plus(txResult.fee.gas)
    .toFixed() as uUST;

  const txHash = txResult.result.txhash;

  return {
    redeemAmount,
    burnAmount,
    exchangeRate,
    txFee,
    txHash,
  };
}
