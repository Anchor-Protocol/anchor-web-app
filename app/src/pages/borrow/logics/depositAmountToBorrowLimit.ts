import type { Rate, ubLuna, uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';

export const depositAmountToBorrowLimit = (
  balance: uUST<BigSource>,
  spendable: uUST<BigSource>,
  oraclePrice: Rate<BigSource>,
  bLunaMaxLtv: Rate<BigSource>,
) => (depositAmount: ubLuna<BigSource>) => {
  return big(
    big(big(balance).minus(spendable).plus(depositAmount)).mul(oraclePrice),
  ).mul(bLunaMaxLtv) as uUST<Big>;
};
