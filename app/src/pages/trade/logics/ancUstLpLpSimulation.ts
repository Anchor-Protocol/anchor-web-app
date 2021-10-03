import { ANC, AncUstLP, cw20, Rate, u, UST } from '@anchor-protocol/types';
import { AnchorBank } from '@anchor-protocol/app-provider/hooks/useAnchorBank';
import { max, min } from '@libs/big-math';
import { demicrofy, microfy } from '@libs/formatter';
import big, { Big, BigSource } from 'big.js';
import { AncPrice } from 'pages/trade/models/ancPrice';
import { AncUstLpSimulation } from 'pages/trade/models/ancUstLpSimulation';

export function ancUstLpLpSimulation(
  ancPrice: AncPrice,
  userLpBalance: cw20.BalanceResponse<AncUstLP> | undefined,
  lpAmount: AncUstLP,
  fixedGas: u<UST<BigSource>>,
  bank: AnchorBank,
): AncUstLpSimulation<Big> {
  if (lpAmount.length === 0) {
    throw new Error(`Can't not be lpAmount is empty string`);
  }

  const lp = microfy(lpAmount);

  const anc = big(ancPrice.ANCPoolSize).mul(lp).div(ancPrice.LPShare) as u<
    ANC<Big>
  >;

  const ust = big(ancPrice.USTPoolSize).mul(lp).div(ancPrice.LPShare) as u<
    UST<Big>
  >;

  const poolPrice = microfy(ancPrice.ANCPrice) as u<UST<Big>>;

  const lpFromTx = userLpBalance
    ? (max(0, big(userLpBalance.balance).minus(lp)) as u<AncUstLP<Big>>)
    : (big(0) as u<AncUstLP<Big>>);

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

    ancAmount: demicrofy(anc),
    ustAmount: demicrofy(ust),
  };
}
