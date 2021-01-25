import { bLuna, microfy, Ratio, uUST } from '@anchor-protocol/notation';
import big, { Big, BigSource } from 'big.js';
import { useMemo } from 'react';

// New Borrow Limit = ((Borrow_info.balance - Borrow_info.spendable - redeemed_collateral) * Oracleprice) * Max_LTV

export function useRedeemCollateralBorrowLimit(
  redeemAmount: bLuna,
  balance: uUST<BigSource>,
  spendable: uUST<BigSource>,
  oraclePrice: Ratio<BigSource>,
  bLunaMaxLtv: Ratio<BigSource>,
): uUST<Big> | undefined {
  return useMemo(() => {
    if (redeemAmount.length === 0) {
      return undefined;
    }

    const borrowLimit = big(
      big(big(balance).minus(spendable).minus(microfy(redeemAmount))).mul(
        oraclePrice,
      ),
    ).mul(bLunaMaxLtv) as uUST<Big>;

    return borrowLimit.lt(0) ? undefined : borrowLimit;
  }, [redeemAmount, balance, spendable, oraclePrice, bLunaMaxLtv]);
}
