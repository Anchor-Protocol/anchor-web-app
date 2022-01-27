import { min } from '@libs/big-math';
import { Rate, u, UST } from '@libs/types';
import big, { Big, BigSource } from 'big.js';

export function estimatedAmountOfClaimBAsset(
  claimableRewards: u<UST<BigSource>>,
  taxRate: Rate,
  maxTaxUUSD: u<UST>,
  fixedFee: u<UST>,
): { txFee: u<UST<Big>>; estimatedAmount: u<UST<Big>> } | undefined {
  if (big(claimableRewards).lte(0)) {
    return undefined;
  }

  // Tx_fee = MIN(
  //    (Claimable_Reward - Claimable_Reward / (1+Tax_rate)) * Tax_rate
  //    , Max_tax
  // ) + Fixed_gas
  const txFee = min(
    big(big(claimableRewards).div(big(1).plus(taxRate))).mul(taxRate),
    maxTaxUUSD,
  ).plus(fixedFee) as u<UST<Big>>;

  const estimatedAmount = big(claimableRewards).minus(txFee) as u<UST<Big>>;

  return estimatedAmount.gt(0)
    ? {
        txFee,
        estimatedAmount,
      }
    : undefined;
}
