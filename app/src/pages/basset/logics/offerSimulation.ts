import { min } from '@anchor-protocol/big-math';
import type { Rate, ubLuna, uLuna, uUST } from '@anchor-protocol/types';
import { terraswap } from '@anchor-protocol/types';
import big, { Big } from 'big.js';
import { Data as TaxData } from 'queries/tax';
import { SwapSimulation } from '../models/swapSimulation';

export function offerSimulation(
  offerSimulation: terraswap.SimulationResponse<uLuna>,
  burnAmount: ubLuna,
  { taxRate, maxTaxUUSD }: TaxData,
): SwapSimulation {
  const beliefPrice = big(offerSimulation.return_amount).div(burnAmount);
  const maxSpread = 0.1;

  const tax = min(
    big(burnAmount).mul(beliefPrice).mul(taxRate),
    maxTaxUUSD,
  ) as uUST<Big>;
  const expectedAmount = big(burnAmount).mul(beliefPrice).minus(tax);
  const rate = big(1).minus(maxSpread);
  const minimumReceived = expectedAmount.mul(rate).toFixed() as uLuna;
  const swapFee = big(offerSimulation.commission_amount)
    .plus(offerSimulation.spread_amount)
    .toFixed() as uLuna;

  return {
    ...offerSimulation,
    minimumReceived,
    swapFee,
    beliefPrice: beliefPrice.toFixed() as Rate,
    maxSpread: maxSpread.toString() as Rate,

    lunaAmount: big(burnAmount).mul(beliefPrice).toString() as uLuna,
  };
}
