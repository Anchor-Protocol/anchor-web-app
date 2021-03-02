import { max, min } from '@anchor-protocol/big-math';
import { microfy } from '@anchor-protocol/notation';
import {
  ANC,
  anchorToken,
  AncUstLP,
  cw20,
  Rate,
  uAncUstLP,
  UST,
  uUST,
} from '@anchor-protocol/types';
import big, { Big, BigSource } from 'big.js';
import { Bank } from 'contexts/bank';
import { AncPrice } from 'pages/gov/models/ancPrice';
import { AncUstLpSimulation } from 'pages/gov/models/ancUstLpSimulation';

export function ancUstLpLpSimulation(
  ancPrice: AncPrice,
  userLpBalance: cw20.BalanceResponse<uAncUstLP>,
  userLpStakingInfo: anchorToken.staking.StakerInfoResponse,
  lpAmount: AncUstLP,
  fixedGas: uUST<BigSource>,
  bank: Bank,
): AncUstLpSimulation<Big> {
  if (lpAmount.length === 0) {
    throw new Error(`Can't not be lpAmount is empty string`);
  }

  const ancAmount = big(ancPrice.ANCPoolSize)
    .mul(lpAmount)
    .div(ancPrice.LPShare) as ANC<Big>;
  const ustAmount = big(ancPrice.USTPoolSize)
    .mul(lpAmount)
    .div(ancPrice.LPShare) as UST<Big>;

  const poolPrice = microfy(ancPrice.ANCPrice) as uUST<Big>;
  const lpFromTx = max(
    0,
    big(userLpBalance.balance).minus(microfy(lpAmount)),
  ) as AncUstLP<Big>;
  const shareOfPool = lpFromTx.div(
    big(ancPrice.LPShare).plus(lpFromTx),
  ) as Rate<Big>;
  const txFee = min(ustAmount.mul(bank.tax.taxRate), bank.tax.maxTaxUUSD).plus(
    fixedGas,
  ) as uUST<Big>;

  console.log(
    'ancUstLpLpSimulation.ts..ancUstLpLpSimulation()',
    ustAmount.toFixed(),
  );

  return {
    poolPrice,
    lpFromTx,
    shareOfPool,
    txFee,

    ancAmount,
    ustAmount,
  };
}
