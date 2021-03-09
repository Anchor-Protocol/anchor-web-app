import { min } from '@anchor-protocol/big-math';
import { demicrofy, microfy } from '@anchor-protocol/notation';
import { ANC, Rate, uAncUstLP, uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { Bank } from '@anchor-protocol/web-contexts/contexts/bank';
import { AncPrice } from 'pages/gov/models/ancPrice';
import { AncUstLpSimulation } from 'pages/gov/models/ancUstLpSimulation';

export function ancUstLpAncSimulation(
  ancPrice: AncPrice,
  ancAmount: ANC,
  fixedGas: uUST<BigSource>,
  bank: Bank,
): AncUstLpSimulation<Big> {
  if (ancAmount.length === 0) {
    throw new Error(`Can't not be ancAmount is empty string`);
  }

  const anc = microfy(ancAmount);
  const ust = big(anc).mul(ancPrice.ANCPrice) as uUST<Big>;

  const poolPrice = microfy(ancPrice.ANCPrice) as uUST<Big>;

  const lpFromTx = min(
    anc.mul(ancPrice.LPShare).div(ancPrice.ANCPoolSize),
    ust.mul(ancPrice.LPShare).div(ancPrice.USTPoolSize),
  ) as uAncUstLP<Big>;

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
    ustAmount: demicrofy(ust),
  };
}
