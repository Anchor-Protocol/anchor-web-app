import { min } from '@anchor-protocol/big-math';
import { microfy } from '@anchor-protocol/notation';
import { ANC, AncUstLP, Rate, UST, uUST } from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { Bank } from 'contexts/bank';
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

  const ustAmount = big(ancAmount).mul(ancPrice.ANCPrice) as UST<Big>;

  const poolPrice = microfy(ancPrice.ANCPrice) as uUST<Big>;
  const lpFromTx = min(
    big(ancAmount).mul(ancPrice.ANCPoolSize).div(ancPrice.LPShare),
    ustAmount.mul(ancPrice.USTPoolSize).div(ancPrice.LPShare),
  ) as AncUstLP<Big>;
  const shareOfPool = lpFromTx.div(
    big(ancPrice.LPShare).plus(lpFromTx),
  ) as Rate<Big>;
  const txFee = min(
    microfy(ustAmount.mul(bank.tax.taxRate) as UST<Big>),
    bank.tax.maxTaxUUSD,
  ).plus(fixedGas) as uUST<Big>;

  console.log('ancUstLpAncSimulation.ts..ancUstLpAncSimulation()', {
    lpFromTx: lpFromTx.toFixed(),
    lpShare: ancPrice.LPShare,
  });

  return {
    poolPrice,
    lpFromTx,
    shareOfPool,
    txFee,
    ustAmount,
  };
}
