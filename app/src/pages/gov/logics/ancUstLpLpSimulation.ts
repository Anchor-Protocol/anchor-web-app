import { demicrofy, microfy } from '@anchor-protocol/notation';
import {
  AncUstLP,
  cw20,
  Rate,
  uANC,
  uAncUstLP,
  uUST,
} from '@anchor-protocol/types';
import { max, min } from '@terra-dev/big-math';
import { Bank } from 'contexts/bank';
import big, { Big, BigSource } from 'big.js';
import { AncPrice } from 'pages/gov/models/ancPrice';
import { AncUstLpSimulation } from 'pages/gov/models/ancUstLpSimulation';

export function ancUstLpLpSimulation(
  ancPrice: AncPrice,
  userLpBalance: cw20.BalanceResponse<uAncUstLP> | undefined,
  lpAmount: AncUstLP,
  fixedGas: uUST<BigSource>,
  bank: Bank,
): AncUstLpSimulation<Big> {
  if (lpAmount.length === 0) {
    throw new Error(`Can't not be lpAmount is empty string`);
  }

  const lp = microfy(lpAmount);

  const anc = big(ancPrice.ANCPoolSize)
    .mul(lp)
    .div(ancPrice.LPShare) as uANC<Big>;

  const ust = big(ancPrice.USTPoolSize)
    .mul(lp)
    .div(ancPrice.LPShare) as uUST<Big>;

  const poolPrice = microfy(ancPrice.ANCPrice) as uUST<Big>;

  const lpFromTx = userLpBalance
    ? (max(0, big(userLpBalance.balance).minus(lp)) as uAncUstLP<Big>)
    : (big(0) as uAncUstLP<Big>);

  const shareOfPool = lpFromTx.div(
    big(ancPrice.LPShare).plus(lpFromTx),
  ) as Rate<Big>;

  const txFee = min(ust.mul(bank.tax.taxRate), bank.tax.maxTaxUUSD).plus(
    fixedGas,
  ) as uUST<Big>;

  return {
    poolPrice,
    lpFromTx: demicrofy(lpFromTx),
    shareOfPool,
    txFee,

    ancAmount: demicrofy(anc),
    ustAmount: demicrofy(ust),
  };
}
