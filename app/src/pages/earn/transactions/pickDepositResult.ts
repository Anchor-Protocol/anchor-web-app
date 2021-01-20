import { Data } from 'api/queries/txInfos';
import { TxResult } from 'api/transactions/tx';
import big from 'big.js';

interface Result {
  depositAmount: string | undefined;
  receivedAmount: string | undefined;
  exchangeRate: string | undefined;
  txFee: string;
  txHash: string;
  rawLog: string;
}

export function pickDepositResult({
  txInfos,
  txResult,
}: { txResult: TxResult } & { txInfos: Data }): Result {
  const fromContract =
    Array.isArray(txInfos[0].RawLog) && txInfos[0].RawLog[0].events[1];

  if (!fromContract) {
    console.error({ txInfos, txResult });
    throw new Error(`Failed contract result parse`);
  }

  const depositAmount = fromContract.attributes.find(
    ({ key }: { key: string }) => key === 'deposit_amount',
  )?.value;

  const receivedAmount = fromContract.attributes.find(
    ({ key }: { key: string }) => key === 'mint_amount',
  )?.value;

  const exchangeRate =
    depositAmount &&
    receivedAmount &&
    big(receivedAmount).div(depositAmount).toFixed();

  const txFee = big(txResult.fee.amount[0].amount)
    .plus(txResult.fee.gas)
    .toFixed();

  const txHash = txResult.result.txhash;

  const rawLog = JSON.stringify({ txInfos, txResult }, null, 2);

  return {
    depositAmount,
    receivedAmount,
    exchangeRate,
    txFee,
    txHash,
    rawLog,
  };
}
