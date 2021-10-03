import { ANC, AncUstLP, Rate, u, UST } from '@anchor-protocol/types';
import { AnchorBank } from '@anchor-protocol/app-provider/hooks/useAnchorBank';
import { min } from '@libs/big-math';
import { demicrofy, microfy } from '@libs/formatter';
import big, { Big, BigSource } from 'big.js';
import { AncPrice } from 'pages/trade/models/ancPrice';
import { AncUstLpSimulation } from 'pages/trade/models/ancUstLpSimulation';

export function ancUstLpAncSimulation(
  ancPrice: AncPrice,
  ancAmount: ANC,
  fixedGas: u<UST<BigSource>>,
  bank: AnchorBank,
): AncUstLpSimulation<Big> {
  if (ancAmount.length === 0) {
    throw new Error(`Can't not be ancAmount is empty string`);
  }

  const anc = microfy(ancAmount);
  const ust = big(anc).mul(ancPrice.ANCPrice) as u<UST<Big>>;

  const poolPrice = microfy(ancPrice.ANCPrice) as u<UST<Big>>;

  const lpFromTx = min(
    anc.mul(ancPrice.LPShare).div(ancPrice.ANCPoolSize),
    ust.mul(ancPrice.LPShare).div(ancPrice.USTPoolSize),
  ) as u<AncUstLP<Big>>;

  const shareOfPool = lpFromTx.div(
    big(ancPrice.LPShare).plus(lpFromTx),
  ) as Rate<Big>;

  const txFee = min(ust.mul(bank.tax.taxRate), bank.tax.maxTaxUUSD).plus(
    fixedGas,
  ) as u<UST<Big>>;

  return {
    poolPrice,
    lpFromTx: demicrofy(lpFromTx),
    shareOfPool,
    txFee,
    ustAmount: demicrofy(ust),
  };
}
