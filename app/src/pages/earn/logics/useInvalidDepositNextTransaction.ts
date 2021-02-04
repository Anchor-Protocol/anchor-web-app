import { microfy, UST, uUST } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';
import { Bank } from 'contexts/bank';
import { ReactNode, useMemo } from 'react';

export function useInvalidDepositNextTransaction(
  depositAmount: UST,
  bank: Bank,
  txFee: uUST<Big> | undefined,
  fixedGas: uUST<BigSource>,
  skip: boolean,
): ReactNode {
  return useMemo(() => {
    if (bank.status === 'demo' || depositAmount.length === 0 || skip) {
      return undefined;
    }

    const remainUUSD = big(bank.userBalances.uUSD)
      .minus(microfy(depositAmount))
      .minus(txFee ?? 0);

    if (remainUUSD.lt(fixedGas)) {
      return `You may run out of USD balance needed for future transactions.`;
    }

    return undefined;
  }, [
    bank.status,
    bank.userBalances.uUSD,
    depositAmount,
    fixedGas,
    skip,
    txFee,
  ]);
}
