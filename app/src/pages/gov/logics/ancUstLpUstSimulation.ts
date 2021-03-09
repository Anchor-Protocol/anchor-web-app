import { min } from '@anchor-protocol/big-math';
import { demicrofy, microfy } from '@anchor-protocol/notation';
import { Rate, uANC, uAncUstLP, UST, uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { Bank } from '@anchor-protocol/web-contexts/contexts/bank';
import { AncPrice } from 'pages/gov/models/ancPrice';
import { AncUstLpSimulation } from 'pages/gov/models/ancUstLpSimulation';

export function ancUstLpUstSimulation(
  ancPrice: AncPrice,
  ustAmount: UST,
  fixedGas: uUST<BigSource>,
  bank: Bank,
): AncUstLpSimulation<Big> {
  if (ustAmount.length === 0) {
    throw new Error(`Can't not be ustAmount is empty string`);
  }

  const ust = microfy(ustAmount);
  const anc = big(ust).div(ancPrice.ANCPrice) as uANC<Big>;

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
    ancAmount: demicrofy(anc),
  };
}
