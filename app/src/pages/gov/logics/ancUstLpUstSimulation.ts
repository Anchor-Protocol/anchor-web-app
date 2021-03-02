import { min } from '@anchor-protocol/big-math';
import { microfy } from '@anchor-protocol/notation';
import { ANC, AncUstLP, Rate, UST, uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { Bank } from 'contexts/bank';
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

  const ancAmount = big(ustAmount).div(ancPrice.ANCPrice) as ANC<Big>;

  const poolPrice = microfy(ancPrice.ANCPrice) as uUST<Big>;
  const lpFromTx = min(
    ancAmount.mul(ancPrice.ANCPoolSize).div(ancPrice.LPShare),
    big(ustAmount).mul(ancPrice.USTPoolSize).div(ancPrice.LPShare),
  ) as AncUstLP<Big>;
  const shareOfPool = lpFromTx.div(
    big(ancPrice.LPShare).plus(lpFromTx),
  ) as Rate<Big>;
  const txFee = min(
    big(microfy(ustAmount)).mul(bank.tax.taxRate),
    bank.tax.maxTaxUUSD,
  ).plus(fixedGas) as uUST<Big>;

  return {
    poolPrice,
    lpFromTx,
    shareOfPool,
    txFee,
    ancAmount,
  };
}
