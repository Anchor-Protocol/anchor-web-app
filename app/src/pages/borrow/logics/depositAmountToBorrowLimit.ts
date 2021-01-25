import { Ratio, ubLuna, uUST } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';

export const depositAmountToBorrowLimit = (
  balance: uUST<BigSource>,
  spendable: uUST<BigSource>,
  oraclePrice: Ratio<BigSource>,
  bLunaMaxLtv: Ratio<BigSource>,
) => (depositAmount: ubLuna<BigSource>) => {
  return big(
    big(big(balance).minus(spendable).plus(depositAmount)).mul(oraclePrice),
  ).mul(bLunaMaxLtv) as uUST<Big>;
};
