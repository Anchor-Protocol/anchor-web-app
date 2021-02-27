import { min } from '@anchor-protocol/big-math';
import type { Rate, ubLuna, uLuna, uUST } from '@anchor-protocol/types';
import big, { Big } from 'big.js';
import { Data as TaxData } from 'queries/tax';
import { SwapSimulation } from '../models/swapSimulation';

export function offerSimulation(
  commission_amount: uLuna,
  return_amount: uLuna,
  spread_amount: uLuna,
  burnAmount: ubLuna,
  { taxRate, maxTaxUUSD }: TaxData,
): SwapSimulation {
  const beliefPrice = big(return_amount).div(burnAmount);
  const maxSpread = 0.1;

  const tax = min(
    big(burnAmount).mul(beliefPrice).mul(taxRate),
    maxTaxUUSD,
  ) as uUST<Big>;
  const expectedAmount = big(burnAmount).mul(beliefPrice).minus(tax);
  const rate = big(1).minus(maxSpread);
  const minimumReceived = expectedAmount.mul(rate).toFixed() as uLuna;
  const swapFee = big(commission_amount).plus(spread_amount).toFixed() as uLuna;

  return {
    commission_amount,
    return_amount,
    spread_amount,
    minimumReceived,
    swapFee,
    beliefPrice: beliefPrice.toFixed() as Rate,
    maxSpread: maxSpread.toString() as Rate,

    lunaAmount: big(burnAmount).mul(beliefPrice).toString() as uLuna,
  };
}
