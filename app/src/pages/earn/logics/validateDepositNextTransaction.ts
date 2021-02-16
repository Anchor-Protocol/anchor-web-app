import { microfy, UST, uUST } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';
import { Bank } from 'contexts/bank';

export function validateDepositNextTransaction(
  depositAmount: UST,
  bank: Bank,
  txFee: uUST<Big> | undefined,
  fixedGas: uUST<BigSource>,
  skip: boolean,
) {
  if (depositAmount.length === 0 || skip) {
    return undefined;
  }

  const remainUUSD = big(bank.userBalances.uUSD)
    .minus(microfy(depositAmount))
    .minus(txFee ?? 0);

  if (remainUUSD.lt(fixedGas)) {
    return `You may run out of USD balance needed for future transactions.`;
  }

  return undefined;
}
